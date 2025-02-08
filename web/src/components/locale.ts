import { YukaElement } from '../yuka/types';
import { css, h } from '../yuka';
import { i18n } from '../yuka/i18n';

css(`.locale{
  margin: 15px 0px;
  text-align: center;
}`);

let radioZh: YukaElement<HTMLInputElement>;
let radioEn: YukaElement<HTMLInputElement>;

const comp = h('div', 'locale').appendChild(
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
