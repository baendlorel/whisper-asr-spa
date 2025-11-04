import { btn, div, form, h, input, label, select } from 'kt.js';
import { isAudio, isVideo, loadAudioBuffer, play, audioBufferToWav } from '@/media-handler';
import { audioPlayer, videoPlayer } from '../players';
import { languageOptions } from './language-options';

export class AudioForm {
  private readonly input: HTMLInputElement;
  private readonly label: HTMLLabelElement;
  private readonly form: HTMLFormElement;

  private convertingToAudio: boolean = false;
  private audioFile: File | null = null;

  constructor() {
    this.form = form(
      {
        id: 'audio-form',
        method: 'POST',
        action: '/was/asr',
        enctype: 'multipart/form-data',
      },
      [
        div('basic-options-wrapper', [
          label({ for: 'audio_file' }, 'Media'),
          div('', [
            btn({ id: 'file-selector', type: 'button', click: () => this.input.click() }, 'Choose File'),
            (this.label = label({ id: 'file-label', style: 'margin-left: 5px' })),
            (this.input = input({
              id: 'audio_file',
              type: 'file',
              name: 'audio_file',
              style: 'display: none; width:0px; height:0px;',
            })),
          ]),
          label({ for: 'output' }, 'Output'),
          select({ id: 'output', name: 'output' }, [
            h('option', { value: 'srt', selected: true }, 'srt'),
            h('option', { value: 'text' }, 'text'),
            h('option', { value: 'json' }, 'json'),
            h('option', { value: 'vtt' }, 'vtt'),
            h('option', { value: 'tsv' }, 'tsv'),
          ]),
        ]),
        h('h4', undefined, 'We suggest not to change options below'),

        div('advanced-options-wrapper', [
          div('col-half', [
            label({ for: 'task' }, 'Task'),
            select({ id: 'task', name: 'task' }, [
              h('option', { value: 'transcribe', selected: true }, 'transcribe'),
              h('option', { value: 'translate' }, 'translate to English'),
            ]),
          ]),
          div('col-half', [
            label({ for: 'language' }, 'Language'),
            select({ id: 'language', name: 'language' }, [
              h('option', { value: '', selected: true }, 'auto detect'),
              ...languageOptions.map((o) => h('option', { value: o.value }, o.label)),
            ]),
          ]),
          div('col-half', [
            label({ for: 'encode' }, 'Encode'),
            select({ id: 'encode', name: 'encode' }, [
              h('option', { value: 'true', selected: true }, 'true'),
              h('option', { value: 'false' }, 'false'),
            ]),
          ]),
          div('col-half', [
            label({ for: 'word_timestamps' }, 'Word Timestamps'),
            select({ id: 'word_timestamps', name: 'word_timestamps' }, [
              h('option', { value: 'true' }, 'true'),
              h('option', { value: 'false', selected: true }, 'false'),
            ]),
          ]),
        ]),

        btn({ class: 'execute', type: 'submit' }, 'Submit'),
      ]
    );
  }

  registerEvents() {
    this.input.addEventListener('change', async () => {
      this.input.disabled = true;
      const file = this.input.files && this.input.files[0];

      if (!file) {
        console.log('未选择文件');
        this.input.disabled = false;
        return;
      }

      this.label.textContent = file.name;

      // 预览
      audioPlayer.style.display = 'none';
      videoPlayer.style.display = 'none';
      audioPlayer.el.pause();
      videoPlayer.el.pause();

      if (isAudio(file)) {
        audioPlayer.el.style.display = '';
        this.audioFile = file;
        play(file, audioPlayer.el);
        this.input.disabled = false;
      }

      if (isVideo(file)) {
        videoPlayer.el.style.display = '';
        play(file, videoPlayer.el);
        this.convertingToAudio = true;

        let percentage = 0;

        // todo 制作进度条
        const progress = dialog.progress(() => percentage, {
          progressLabel: { zh: '提取音频中', en: 'Extracting audio' },
        });

        const loader = loadAudioBuffer(file).then((ab) => audioBufferToWav(ab, (p) => (percentage = p)));

        const [, wav] = await Promise.all([progress, loader]).finally(() => {
          this.input.disabled = false;
        });
        this.audioFile = wav;
        this.convertingToAudio = false;
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
      }
    });

    this.form.addEventListener('submit', async (event) => {
      event.preventDefault();

      if (!isAudio(this.audioFile)) {
        alert('Not an audio file!');
        return;
      }

      if (this.convertingToAudio) {
        alert('Still converting! Please try again later.');
        return;
      }

      const formData = new FormData(this.form);
      formData.set('audio_file', this.audioFile as Blob);
      const url = new URL(this.form.action);
      formData.forEach((v, k) => {
        if (typeof v === 'string') {
          url.searchParams.append(k, v);
        }
      });

      // todo 这里还缺少等待进度条
      const resp = await fetch(url, {
        method: this.form.method,
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
