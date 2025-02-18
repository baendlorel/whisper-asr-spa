import { dialog, useYuka } from './yuka';
import typescriptLogo from './assets/typescript.svg';
import locale from './components/locale';
import players from './components/players';
import audioForm from './components/audio-form';
import displayer from './components/displayer';

const { h } = useYuka();

export default h('div', { class: 'container' }).append(
  h('h2', { class: 'title' }).append(
    h('img', { src: typescriptLogo, class: 'logo' }),
    h('span', undefined, 'Whisper ASR')
  ),
  h(
    'button',
    {
      onclick: () => {
        dialog.wait({ zh: '等5秒', en: 'wait 5s' }, 5).then(() => {
          console.log('wait end');
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
