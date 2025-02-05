import { h } from '../modules/common';

export default h('div', { class: 'locale' }).appendChild(
  h('input', { type: 'radio', id: 'ui-en', name: 'ui-language', value: 'en' }),
  h('label', { for: 'ui-en', class: 'ui-language' }, 'English'),
  h('input', { type: 'radio', id: 'ui-zh', name: 'ui-language', value: 'zh' }),
  h('label', { for: 'ui-zh', class: 'ui-language' }, '中文')
);
