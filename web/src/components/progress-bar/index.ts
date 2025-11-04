import { div, span } from 'kt.js';

export class ProgressBar {
  readonly el: HTMLDivElement;
  private readonly bar: HTMLDivElement;
  private readonly label: HTMLSpanElement;
  private readonly percent: HTMLSpanElement;

  constructor() {
    this.label = span({ style: { paddingRight: '5px' } });
    this.percent = span();
    this.bar = div('progress-bar', [this.label, this.percent]);
    this.el = div({ class: 'progress-wrapper' }, this.bar);
  }

  set(percent: number) {
    const p = (percent * 100).toFixed(2) + '%';
    this.bar.style.width = p;
    this.percent.textContent = p;
  }

  setLabel(text: string) {
    this.label.textContent = text;
  }
}
