import { dialog, useYuka, Yuka } from '@/yuka';
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
let submit: Yuka<HTMLButtonElement>;

const comp = h('div', 'form-wrapper').append(
  h('div', 'bar').append(
    progressBarComponent,
    (download = h('button', { disabled: 'true' }, { zh: '下载音频', en: 'Download' }))
  ),
  (audioForm = h('form', {
    id: 'audio-form',
    method: 'POST',
    action: '/was/asr',
    enctype: 'multipart/form-data',
  }).append(
    h('div', 'basic-options-wrapper').append(
      h(
        'label',
        { for: 'audio_file' },
        {
          zh: '音视频',
          en: 'Media',
        }
      ),
      h('div').append(
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
      h('select', { id: 'output', name: 'output' }).append(
        h('option', { value: 'text' }, { zh: '文本', en: 'Text' }),
        h('option', { value: 'json' }, { zh: 'JSON', en: 'JSON' }),
        h('option', { value: 'vtt' }, { zh: 'VTT', en: 'VTT' }),
        h('option', { value: 'srt', selected: true }, { zh: 'SRT', en: 'SRT' }),
        h('option', { value: 'text' }, { zh: 'TSV', en: 'TSV' })
      )
    ),
    h('h4', undefined, { zh: '以下都推荐默认设置', en: 'We suggest not to change options below' }),
    h('div', 'advanced-options-wrapper').append(
      h('div', 'col-half').append(
        h(
          'label',
          { for: 'task' },
          {
            zh: '任务',
            en: 'Task',
          }
        ),
        h('select', { id: 'task', name: 'task' }).append(
          h(
            'option',
            { value: 'transcribe', selected: true },
            { zh: '转录为文本/字幕', en: 'transcribe' }
          ),
          h('option', { value: 'translate' }, { zh: '翻译（仅能译为英文）', en: 'translate' })
        )
      ),
      h('div', 'col-half').append(
        h('label', { for: 'language' }, { zh: '语言选择', en: 'Language' }),
        h('select', { id: 'language', name: 'language' }).append(
          h('option', { value: '', selected: true }, { zh: '自动检测', en: 'auto detect' }),
          ...languageOptions.map((o) => h('option', { value: o.value }, o.label))
        )
      ),
      h('div', 'col-half').append(
        h('label', { for: 'encode' }, { zh: '编码音频', en: 'Encode' }),
        h('select', { id: 'encode', name: 'encode' }).append(
          h('option', { value: 'true', selected: true }, { zh: '是（默认）', en: 'true' }),
          h('option', { value: 'false' }, { zh: '否', en: 'false' })
        )
      ),
      h('div', 'col-half').append(
        h('label', { for: 'word_timestamps' }, { zh: '字词级时间戳', en: 'Word Timestamps' }),
        h('select', { id: 'word_timestamps', name: 'word_timestamps' }).append(
          h('option', { value: 'true' }, { zh: '是', en: 'true' }),
          h('option', { value: 'false', selected: true }, { zh: '否（默认）', en: 'false' })
        )
      )
    ),
    (submit = h('button', { class: 'execute', type: 'submit' }, { zh: '提交', en: 'Submit' }))
  )),
  (asr = h('button', 'execute', { zh: '执行', en: 'Execute' }))
);

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
  fileInput.disabled = true;
  const file = fileInput.files && fileInput.files[0];

  if (!file) {
    console.log('未选择文件');
    fileInput.disabled = false;
    return;
  }

  // 设置label里的文件名
  fileLabel.text = file.name;

  // 预览
  audioPlayer.style.display = 'none';
  videoPlayer.style.display = 'none';
  audioPlayer.el.pause();
  videoPlayer.el.pause();

  if (isAudio(file)) {
    audioPlayer.el.style.display = '';
    audioFile = file;
    play(file, audioPlayer.el);
    fileInput.disabled = false;
  }

  if (isVideo(file)) {
    videoPlayer.el.style.display = '';
    play(file, videoPlayer.el);
    isConvertingToAudioFile = true;
    download.disabled = true;
    setProgress(0.001);
    setLabel({ zh: '正在提取音频', en: 'Extracting Audio' });
    loadAudioBuffer(file)
      .then((ab) => audioBufferToWav(ab, setProgress))
      .then((file) => {
        audioFile = file;
        isConvertingToAudioFile = false;
        download.disabled = false;
      })
      .finally(() => {
        fileInput.disabled = false;
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
      console.log('data', data);
      dialog.alert(`/was/asr Request sent successfully!`);
    })
    .catch((error) => {
      console.info('Error sending request.');
      console.error('9000/was/asr Error:', error);
    });
});

audioForm.on('submit', (event) => {
  event.preventDefault(); // 阻止默认提交（防止页面刷新）

  if (!isAudio(audioFile)) {
    dialog.alert({ zh: '不是音视频文件', en: 'Not an audio file!' });
    return;
  }

  if (isConvertingToAudioFile) {
    dialog.alert({ zh: '还在转换中，请稍后提交', en: 'Still converting! Please try again later.' });
    return;
  }

  const form = event.target as HTMLFormElement;
  const formData = new FormData(form); // 创建 FormData 对象，自动收集表单数据
  formData.set('audio_file', audioFile as Blob);

  if (formData.get('language') === '') {
    formData.delete('language');
  }

  const resp = fetch(form.action, {
    // 发送请求到服务器
    method: form.method,
    body: formData,
  })
    .then((response) => response.json()) // 解析服务器返回的数据
    .then((data) => {
      console.log('resp', data); // 显示服务器返回的内容
    });

  dialog.wait(
    { zh: '请求已发送，请稍候...', en: 'Request sent successfully! Please wait...' },
    resp
  );
  resp.catch((error) => console.error('Error:', error));
});

console.log('audioform comp', comp);
console.log('asr', asr);

export default comp;
