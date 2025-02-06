import { h } from '../modules/common';
import { YukaElement } from '../types';

let videoPlayer: YukaElement<HTMLVideoElement>;
let audioPlayer: YukaElement<HTMLAudioElement>;

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
