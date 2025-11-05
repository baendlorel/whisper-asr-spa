import { div, span } from 'kt.js';
import './style.css';

export class ProgressBar {
  readonly el: HTMLDivElement;
  private readonly bar: HTMLDivElement;
  private readonly label: HTMLSpanElement;
  private readonly percent: HTMLSpanElement;

  private _value: number = 0;

  constructor() {
    this.label = span({ style: 'padding-right:5px' });
    this.percent = span();
    this.bar = div('progress-bar', [this.label, this.percent]);
    this.el = div({ class: 'progress-wrapper' }, this.bar);
  }

  set(percent: number) {
    const p = (percent * 100).toFixed(2) + '%';
    this.bar.style.width = p;
    this.percent.textContent = p;
    this._value = percent;
  }

  get value() {
    return this._value;
  }

  setLabel(text: string) {
    this.label.textContent = text;
  }
}
