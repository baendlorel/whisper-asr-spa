import typescriptLogo from './assets/typescript.svg';
import { AudioForm } from './components/audio-form';
import { displayer } from './components/displayer';
import { div, h2, img, span } from 'kt.js';

const audioForm = new AudioForm();
export default div('container', [
  h2('title', [img({ src: typescriptLogo, class: 'logo' }), span(undefined, 'Whisper ASR')]),
  displayer,
  audioForm.el,
  audioForm.player.el,
]);
