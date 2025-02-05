import { h } from '../modules/common';

export default h('div', { class: 'player-wrapper' }).appendChild(
  h('video', { id: 'video-player', control: '', style: 'display: none; width:100%;' }),
  h('audio', { id: 'audio-player', control: '', style: 'display: none; width:100%;' })
);
