import { h } from '../modules/common';

export default h('div', { class: 'form-wrapper' }).appendChild(
  h('form', { id: 'audio-form' }).appendChild(
    h('div', { class: 'basic-options-wrapper' }).appendChild(
      h(
        'label',
        { for: 'audio_file' },
        {
          zh: '音视频',
          en: 'Audio/Video',
        }
      ),
      h('div').appendChild(
        h(
          'button',
          { id: 'file-selector', type: 'button' },
          {
            zh: '选择文件',
            en: 'Choose File',
          }
        ),
        h('label', { id: 'file-label' }),
        h('input', {
          id: 'audio_file',
          type: 'file',
          name: 'audio_file',
          style: 'visibility: hidden;width:0px;height:0px;',
        })
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
          h('option', { value: 'transcribe', selected: '' }, { zh: '自动检测', en: 'auto detect' })
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
  ),
  h('button', { id: 'asr', class: 'execute' }, { zh: '执行', en: 'Execute' })
);
