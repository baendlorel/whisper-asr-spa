import { HTMLElementType, YukaElement } from '.';

export class TQueryResult extends Array {
  private on<K extends keyof HTMLElementEventMap>(
    type: K,
    listener: EventListenerOrEventListenerObject,
    options?: boolean | AddEventListenerOptions
  ) {
    this.forEach((yukaEl) => {
      yukaEl.on(type, listener, options);
    });
  }
}

export type TQuery = {
  (selectors: keyof HTMLElementTagNameMap | string): YukaElement<HTMLElementType>[];
};
