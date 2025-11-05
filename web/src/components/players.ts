import { div, h, span } from 'kt.js';

export class Player {
  readonly el: HTMLDivElement;
  readonly video: HTMLVideoElement;
  readonly audio: HTMLAudioElement;
  private readonly mediaInfo: HTMLDivElement;

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

    // Create media info display
    this.mediaInfo = div({ class: 'media-info', style: 'display: none;' });

    this.el = div('player-container', [this.mediaInfo, this.video, this.audio]);
  }

  setMediaInfo(info?: { fileName: string; fileSize: number; fileType: string }) {
    this.mediaInfo.innerHTML = '';

    if (!info) {
      this.mediaInfo.style.display = 'none';
      return;
    }

    const fileNameItem = div('info-item', [span('info-label', 'File:'), span('info-value', info.fileName)]);
    const sizeInKB = (info.fileSize / 1024).toFixed(2);
    const sizeItem = div('info-item', [span('info-label', 'Size:'), span('info-value', `${sizeInKB} KB`)]);
    const typeItem = div('info-item', [span('info-label', 'Type:'), span('info-value', info.fileType)]);
    this.mediaInfo.append(fileNameItem, sizeItem, typeItem);
  }
}
