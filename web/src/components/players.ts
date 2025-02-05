import { h } from '../modules/common';
import { RichElement } from '../types';

let videoPlayer: RichElement<HTMLVideoElement>;
let audioPlayer: RichElement<HTMLAudioElement>;

export default h('div', { class: 'player-wrapper' }).appendChild(
  (videoPlayer = h('video', {
    id: 'video-player',
    controls: 'controls',
    style: 'display: none; width:100%;',
  })),
  (audioPlayer = h('audio', {
    id: 'audio-player',
    controls: 'controls',
    style: 'display: none; width:100%;',
  }))
);

export { videoPlayer, audioPlayer };
