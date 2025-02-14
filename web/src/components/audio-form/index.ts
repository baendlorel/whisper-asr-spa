import { useYuka, Yuka } from '@/yuka';
import { isAudio, isVideo, loadAudioBuffer, play, audioBufferToWav } from '@/media-handler';
import { audioPlayer, videoPlayer } from '../players';
import progressBar from '../progress-bar';
import { languageOptions } from './language-options';
import style from './style.css?raw';
import wasService from '@/services/was.service';

const { css, h, eventBus } = useYuka();

css(style);

const { component: progressBarComponent, setProgress, setLabel } = progressBar();

let download: Yuka<HTMLButtonElement>;
let fileInput: Yuka<HTMLInputElement>;
let fileLabel: Yuka<HTMLLabelElement>;

let audioForm: Yuka<HTMLFormElement>;
let asr: Yuka<HTMLButtonElement>;

const comp = h('div', 'form-wrapper').appendChild(
  h('div', 'bar').appendChild(
    progressBarComponent,
    (download = h('button', { disabled: 'true' }, { zh: '下载音频', en: 'Download' }))
  ),
  (audioForm = h('form', { id: 'audio-form' }).appendChild(
    h('div', 'basic-options-wrapper').appendChild(
      h(
        'label',
        { for: 'audio_file' },
        {
          zh: '音视频',
          en: 'Media',
        }
      ),
      h('div').appendChild(
        h(
          'button',
          { id: 'file-selector', type: 'button', onclick: () => fileInput.el.click() },
          {
            zh: '选择文件',
            en: 'Choose File',
          }
        ),
        (fileLabel = h('label', { id: 'file-label', style: 'margin-left: 5px' })),
        (fileInput = h('input', {
          id: 'audio_file',
          type: 'file',
          name: 'audio_file',
          style: 'display: none; width:0px; height:0px;',
        }))
      ),
      h(
        'label',
        { for: 'output' },
        {
          zh: '输出格式',
          en: 'Output',
        }
      ),
      h('select', { id: 'output', name: 'output' }).appendChild(
        h('option', { value: 'text' }, { zh: '文本', en: 'Text' }),
        h('option', { value: 'json' }, { zh: 'JSON', en: 'JSON' }),
        h('option', { value: 'vtt' }, { zh: 'VTT', en: 'VTT' }),
        h('option', { value: 'srt', selected: true }, { zh: 'SRT', en: 'SRT' }),
        h('option', { value: 'text' }, { zh: 'TSV', en: 'TSV' })
      )
    ),
    h('h4', undefined, { zh: '以下都推荐默认设置', en: 'We suggest not to change options below' }),
    h('div', 'advanced-options-wrapper').appendChild(
      h('div', 'col-half').appendChild(
        h(
          'label',
          { for: 'task' },
          {
            zh: '任务',
            en: 'Task',
          }
        ),
        h('select', { id: 'task', name: 'task' }).appendChild(
          h(
            'option',
            { value: 'transcribe', selected: true },
            { zh: '转录为文本/字幕', en: 'transcribe' }
          ),
          h('option', { value: 'translate' }, { zh: '翻译（仅能译为英文）', en: 'translate' })
        )
      ),
      h('div', 'col-half').appendChild(
        h('label', { for: 'language' }, { zh: '语言选择', en: 'Language' }),
        h('select', { id: 'language', name: 'language' }).appendChild(
          h('option', { value: '', selected: true }, { zh: '自动检测', en: 'auto detect' }),
          ...languageOptions.map((o) => h('option', { value: o.value }, o.label))
        )
      ),
      h('div', 'col-half').appendChild(
        h('label', { for: 'encode' }, { zh: '编码音频', en: 'Encode' }),
        h('select', { id: 'encode', name: 'encode' }).appendChild(
          h('option', { value: 'true', selected: true }, { zh: '是（默认）', en: 'true' }),
          h('option', { value: 'false' }, { zh: '否', en: 'false' })
        )
      ),
      h('div', 'col-half').appendChild(
        h('label', { for: 'word_timestamps' }, { zh: '字词级时间戳', en: 'Word Timestamps' }),
        h('select', { id: 'word_timestamps', name: 'word_timestamps' }).appendChild(
          h('option', { value: 'true' }, { zh: '是', en: 'true' }),
          h('option', { value: 'false', selected: true }, { zh: '否（默认）', en: 'false' })
        )
      )
    )
  )),
  (asr = h('button', { id: 'asr', class: 'execute' }, { zh: '执行', en: 'Execute' }))
);

setLabel({ zh: '正在提取音频', en: 'Extracting Audio' });

let isConvertingToAudioFile = false;
let audioFile: File | null = null;

download.on('click', () => {
  console.log('audioFile', audioFile);
  if (audioFile === null) {
    console.log('还没有音频文件');
    return;
  }

  const url: any = URL.createObjectURL(audioFile);
  const link = document.createElement('a');
  link.style.display = 'none';
  link.href = url;
  link.setAttribute('download', audioFile.name);
  document.body.appendChild(link);
  link.click();
  URL.revokeObjectURL(url.href);
  document.body.removeChild(link);
});

fileInput.on('change', () => {
  const file = fileInput.files && fileInput.files[0];

  if (!file) {
    console.log('未选择文件');
    return;
  }

  // 设置label里的文件名
  fileLabel.el.textContent = file.name;

  // 预览
  audioPlayer.el.style.display = 'none';
  videoPlayer.el.style.display = 'none';
  audioPlayer.el.pause();
  videoPlayer.el.pause();

  if (isAudio(file)) {
    audioPlayer.el.style.display = '';
    audioFile = file;
    play(file, audioPlayer.el);
  }

  if (isVideo(file)) {
    videoPlayer.el.style.display = '';
    play(file, videoPlayer.el);
    isConvertingToAudioFile = true;
    download.disabled = true;
    setProgress(0.001);
    loadAudioBuffer(file)
      .then((ab) => audioBufferToWav(ab, setProgress))
      .then((file) => {
        download.disabled = false;
        audioFile = file;
        isConvertingToAudioFile = false;
      });
  }
});

asr.on('click', () => {
  if (isConvertingToAudioFile) {
    alert('Still converting! Please try again later.');
    return;
  }

  const formData = new FormData(audioForm.el);

  if (formData.get('language') === '') {
    formData.delete('language');
  }

  formData.set('audio_file', audioFile as Blob);
  if (!isAudio(audioFile)) {
    alert('不是音视频文件');
    return;
  }

  const args: any = {};

  formData.forEach((value, key) => {
    args[key] = value;
  });

  console.log('args', args);

  // wasService
  //   .asrForm(formData)
  //   .then((data) => {
  //     console.log(data);
  //     eventBus.emit('display-result', data);
  //   })
  //   .catch((e) => {
  //     console.log({ args });
  //     console.log(e);
  //   });

  fetch('/was/asr', {
    method: 'POST',
    body: args,
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  })
    .then((response) => {
      console.log('resp', response);
      return response.json();
    })
    .then((data) => {
      console.log('%c/was/asr Request sent successfully!', 'color: #43bb88;');
      console.log('data', data);
    })
    .catch((error) => {
      console.info('Error sending request.');
      console.error('9000/was/asr Error:', error);
    });
});

console.log('audioform comp', comp);
console.log('asr', asr);

export default comp;
