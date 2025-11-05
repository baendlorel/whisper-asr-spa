import { div, h } from 'kt.js';

export class Player {
  readonly el: HTMLDivElement;
  readonly video: HTMLVideoElement;
  readonly audio: HTMLAudioElement;
  constructor() {
    this.video = h('video', {
      id: 'video-player',
      controls: 'controls',
      style: 'display: none; width:100%; margin-top:15px',
    });
    this.audio = h('audio', {
      id: 'audio-player',
      controls: 'controls',
      style: 'display: none; width:100%; margin-top:15px',
    });
    this.el = div('player-container', [this.video, this.audio]);
  }
}
