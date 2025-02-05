import { RichElement } from '../types';
import { h } from '../modules/common';
import { i18n } from '../modules/i18n';

let radioZh: RichElement<HTMLInputElement>;
let radioEn: RichElement<HTMLInputElement>;

const comp = h('div', { class: 'locale' }).appendChild(
  (radioZh = h('input', {
    type: 'radio',
    id: 'ui-zh',
    name: 'ui-language',
    value: 'zh',
  })),
  h('label', { for: 'ui-zh', class: 'ui-language' }, '中文'),
  (radioEn = h('input', { type: 'radio', id: 'ui-en', name: 'ui-language', value: 'en' })),
  h('label', { for: 'ui-en', class: 'ui-language' }, 'English')
);

switch (i18n.locale) {
  case 'zh':
    radioZh.el.checked = true;
    break;
  case 'en':
    radioEn.el.checked = true;
    break;
  default:
    throw new Error('locale设置radio失败');
}

radioZh.on('change', () => {
  i18n.locale = 'zh';
});

radioEn.on('change', () => {
  i18n.locale = 'en';
});

export default comp;
