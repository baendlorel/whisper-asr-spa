import { useYuka } from './yuka';
import typescriptLogo from './assets/typescript.svg';
import locale from './components/locale';
import players from './components/players';
import audioForm from './components/audio-form';
import displayer from './components/displayer';

const { h } = useYuka();

export default h('div', { class: 'container' }).appendChild(
  h('h2', { class: 'title' }).appendChild(
    h('img', { src: typescriptLogo, class: 'logo' }),
    h('span', undefined, 'Whisper ASR')
  ),
  locale,
  displayer,
  players,
  audioForm
);
