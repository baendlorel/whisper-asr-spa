import { dialog, useYuka } from './yuka';
import typescriptLogo from './assets/typescript.svg';
import locale from './components/locale';
import players from './components/players';
import audioForm from './components/audio-form';
import displayer from './components/displayer';

const { h } = useYuka();

dialog;

export default h('div', { class: 'container' }).appendChild(
  h('h2', { class: 'title' }).appendChild(
    h('img', { src: typescriptLogo, class: 'logo' }),
    h('span', undefined, 'Whisper ASR')
  ),
  h(
    'button',
    {
      onclick: () => {
        dialog
          .confirm(
            { zh: '你确定吗', en: 'Are you sure?' },
            {
              onYes: () => {
                return dialog.confirm({ zh: '你真的确定吗', en: 'Are you sure2?' });
              },
            }
          )
          .then((result) => {
            console.log('result', result);
          });
      },
    },
    'click me'
  ),
  locale,
  displayer,
  players,
  audioForm
);
