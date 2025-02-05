import { RichElement } from '../types';
import { h } from '../modules/common';
import { isAudio, isVideo, play } from '../modules/video-audio-manager';
import { audioPlayer, videoPlayer } from './players';
import languageOptions from './language-options';

let fileSelector: RichElement<HTMLButtonElement>;
let fileInput: RichElement<HTMLInputElement>;
let fileLabel: RichElement<HTMLLabelElement>;

let audioForm: RichElement<HTMLFormElement>;
let asr: RichElement<HTMLButtonElement>;

const comp = h('div', { class: 'form-wrapper' }).appendChild(
  (audioForm = h('form', { id: 'audio-form' }).appendChild(
    h('div', { class: 'basic-options-wrapper' }).appendChild(
      h(
        'label',
        { for: 'audio_file' },
        {
          zh: '音视频',
          en: 'Media',
        }
      ),
      h('div').appendChild(
        (fileSelector = h(
          'button',
          { id: 'file-selector', type: 'button' },
          {
            zh: '选择文件',
            en: 'Choose File',
          }
        )),
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
        h('option', { value: 'srt', selected: '' }, { zh: 'SRT', en: 'SRT' }),
        h('option', { value: 'text' }, { zh: 'TSV', en: 'TSV' })
      )
    ),
    h('h4', undefined, { zh: '以下都推荐默认设置', en: 'We suggest not to change options below' }),
    h('div', { class: 'advanced-options-wrapper' }).appendChild(
      h('div', { class: 'col-half' }).appendChild(
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
            { value: 'transcribe', selected: '' },
            { zh: '转录为文本/字幕', en: 'transcribe' }
          ),
          h('option', { value: 'translate' }, { zh: '翻译（仅能译为英文）', en: 'translate' })
        )
      ),
      h('div', { class: 'col-half' }).appendChild(
        h('label', { for: 'language' }, { zh: '语言选择', en: 'Language' }),
        h('select', { id: 'language', name: 'language' }).appendChild(
          h('option', { value: '', selected: '' }, { zh: '自动检测', en: 'auto detect' }),
          ...languageOptions
        )
      ),
      h('div', { class: 'col-half' }).appendChild(
        h('label', { for: 'encode' }, { zh: '编码音频', en: 'Encode' }),
        h('select', { id: 'encode', name: 'encode' }).appendChild(
          h('option', { value: 'true', selected: '' }, { zh: '是（默认）', en: 'true' }),
          h('option', { value: 'false' }, { zh: '否', en: 'false' })
        )
      ),
      h('div', { class: 'col-half' }).appendChild(
        h('label', { for: 'word_timestamps' }, { zh: '字词级时间戳', en: 'Word Timestamps' }),
        h('select', { id: 'word_timestamps', name: 'word_timestamps' }).appendChild(
          h('option', { value: 'true' }, { zh: '是', en: 'true' }),
          h('option', { value: 'false', selected: '' }, { zh: '否（默认）', en: 'false' })
        )
      )
    )
  )),
  (asr = h('button', { id: 'asr', class: 'execute' }, { zh: '执行', en: 'Execute' }))
);

fileSelector.on('click', () => {
  fileInput.el.click();
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
    play(file, audioPlayer.el);
  }

  if (isVideo(file)) {
    videoPlayer.el.style.display = '';
    play(file, videoPlayer.el);
    // getAudioStream(videoPlayer.el);
  }
});

asr.on('click', () => {
  const formData = new FormData(audioForm.el);

  if (formData.get('language') === '') {
    formData.delete('language');
  }

  const file = formData.get('audio_file');
  if (!isAudio(file) && !isVideo(file)) {
    alert('不是音视频文件');
    return;
  }

  formData.forEach((value, key) => {
    console.log(key, value);
  });

  fetch('/was/asr', {
    method: 'POST',
    body: formData,
  })
    .then((response) => response.json())
    .then((data) => {
      console.log('Success:', data);
      alert('Request sent successfully!');
    })
    .catch((error) => {
      console.error('Error:', error);
      alert('Error sending request.');
    });
});

export default comp;
