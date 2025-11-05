import { btn, div, form, h, input, label, select } from 'kt.js';
import { isAudio, isVideo, loadAudioBuffer, play, audioBufferToWav } from '@/media-handler';
import { Player } from '../players';
import { languageOptions } from './language-options';
import { TimerDialog } from '../timer-dialog';
import { ProgressBar } from '../progress-bar';

export class AudioForm {
  readonly player = new Player();

  readonly el: HTMLFormElement;
  private readonly input: HTMLInputElement;
  private readonly advancedOptionsToggle: HTMLButtonElement;
  private readonly advancedOptionsWrapper: HTMLDivElement;

  private convertingToAudio: boolean = false;
  private audioFile: File | null = null;

  constructor() {
    // Create advanced options wrapper with collapse functionality
    this.advancedOptionsWrapper = div({ class: 'options-wrapper advanced-options', style: 'display: none;' }, [
      div('form-entry', [
        label({ for: 'task' }, 'Task'),
        select({ id: 'task', name: 'task' }, [
          h('option', { value: 'transcribe', selected: true }, 'transcribe'),
          h('option', { value: 'translate' }, 'translate to English'),
        ]),
      ]),
      div('form-entry', [
        label({ for: 'language' }, 'Language'),
        select({ id: 'language', name: 'language' }, [
          h('option', { value: '', selected: true }, 'auto detect'),
          ...languageOptions.map((o) => h('option', { value: o.value }, o.label)),
        ]),
      ]),
      div('form-entry-single', [
        input({ type: 'checkbox', id: 'encode', name: 'Encode', checked: true }),
        label({ for: 'encode' }, 'Encode'),
      ]),
      div('form-entry-single', [
        input({ type: 'checkbox', id: 'word_timestamps', name: 'word_timestamps', checked: false }),
        label({ for: 'word_timestamps' }, 'Word Timestamps'),
      ]),
    ]);

    // Create toggle button for advanced options
    this.advancedOptionsToggle = btn(
      {
        type: 'button',
        class: 'advanced-toggle',
      },
      '▼ Advanced Options'
    );

    this.el = form(
      {
        id: 'audio-form',
        method: 'POST',
        action: '/was/asr',
        enctype: 'multipart/form-data',
      },
      [
        div('options-wrapper', [
          div('form-entry', [
            label({ for: 'audio_file' }, 'Media'),
            div('', [
              btn({ id: 'file-selector', type: 'button', click: () => this.input.click() }, 'Choose File'),
              (this.input = input({
                id: 'audio_file',
                type: 'file',
                name: 'audio_file',
                style: 'display: none; width:0px; height:0px;',
              })),
            ]),
          ]),
          div('form-entry', [
            label({ for: 'output' }, 'Output'),
            select({ id: 'output', name: 'output' }, [
              h('option', { value: 'srt', selected: true }, 'srt'),
              h('option', { value: 'text' }, 'text'),
              h('option', { value: 'json' }, 'json'),
              h('option', { value: 'vtt' }, 'vtt'),
              h('option', { value: 'tsv' }, 'tsv'),
            ]),
          ]),
        ]),
        this.advancedOptionsToggle,
        this.advancedOptionsWrapper,

        btn({ class: 'execute', type: 'submit' }, 'Submit'),
      ]
    );

    this.registerEvents();
  }

  private toggleAdvancedOptions() {
    const isHidden = this.advancedOptionsWrapper.style.display === 'none';
    this.advancedOptionsWrapper.style.display = isHidden ? 'grid' : 'none';
    this.advancedOptionsToggle.textContent = isHidden ? '▲ Advanced Options' : '▼ Advanced Options';
  }

  private updateMediaInfo(file: File) {
    this.player.setMediaInfo({
      fileName: file.name,
      fileSize: file.size,
      fileType: file.type || 'unknown',
    });
  }

  private registerEvents() {
    // Toggle button event
    this.advancedOptionsToggle.addEventListener('click', () => this.toggleAdvancedOptions());

    this.input.addEventListener('change', async () => {
      this.input.disabled = true;
      const file = this.input.files && this.input.files[0];

      if (!file) {
        console.log('未选择文件');
        this.input.disabled = false;
        return;
      }

      // Update media info display
      this.updateMediaInfo(file);

      // 预览
      this.player.audio.style.display = 'none';
      this.player.video.style.display = 'none';
      this.player.audio.pause();
      this.player.video.pause();

      if (isAudio(file)) {
        this.player.audio.style.display = '';
        this.audioFile = file;
        play(file, this.player.audio);
        this.input.disabled = false;
      }

      if (isVideo(file)) {
        this.player.video.style.display = '';
        play(file, this.player.video);
        this.convertingToAudio = true;

        const progressBar = new ProgressBar();
        progressBar.setLabel('Converting');
        const timerDialog = new TimerDialog(progressBar);
        timerDialog.start();

        try {
          const loader = loadAudioBuffer(file).then((ab) => audioBufferToWav(ab, (p) => progressBar.set(p)));
          const wav = await loader;
          this.audioFile = wav;
          this.convertingToAudio = false;

          // Auto stop when done (will also be triggered by progress reaching 100%)
          timerDialog.stop();

          const yes = confirm('Download audio?');
          if (yes) {
            const link = document.createElement('a');
            const url = URL.createObjectURL(wav);
            link.href = url;
            link.download = wav.name;
            link.click();
            // 释放 URL 对象，避免内存泄漏
            URL.revokeObjectURL(url);
            link.remove();
          }
        } catch (error) {
          console.error('Error converting video to audio:', error);
          alert('Failed to convert video to audio');
          timerDialog.stop();
        } finally {
          this.input.disabled = false;
        }
      }
    });

    this.el.addEventListener('submit', async (event) => {
      event.preventDefault();

      if (!isAudio(this.audioFile)) {
        alert('Not an audio file!');
        return;
      }

      if (this.convertingToAudio) {
        alert('Still converting! Please try again later.');
        return;
      }

      const formData = new FormData(this.el);
      formData.set('audio_file', this.audioFile as Blob);
      const url = new URL(this.el.action);
      formData.forEach((v, k) => {
        if (typeof v === 'string') {
          url.searchParams.append(k, v);
        }
      });

      // todo 这里还缺少等待进度条
      const resp = await fetch(url, {
        method: this.el.method,
        body: formData,
      })
        .then((response) => response.text())
        .catch((error) => (console.error(error), null));

      if (!resp) {
        alert('Empty response');
        return;
      }

      this.download(formData, resp);
    });
  }

  download(formData: FormData, subtitle: string) {
    if (typeof subtitle !== 'string') {
      throw new Error('subtitle must be a string');
    }
    const audioFile = formData.get('audio_file');
    if (audioFile instanceof File === false) {
      throw new Error('audioFile must be a file');
    }

    const suffix = ((v) => (v === null || v === 'text' ? 'txt' : v))(formData.get('output'));

    const file = new File([subtitle], audioFile.name.replace(/.[^.]+$/g, '.' + suffix), {
      type: 'text/plain',
    });

    const link = document.createElement('a');
    const url = URL.createObjectURL(file);
    link.href = url;
    link.download = file.name;

    link.click();

    // 释放 URL 对象，避免内存泄漏
    URL.revokeObjectURL(url);

    link.remove();
  }
}
