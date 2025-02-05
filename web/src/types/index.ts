export const LanguageTypes = ['zh', 'en'] as const;

export type LanguageType = (typeof LanguageTypes)[number];

export type I18NConfig = { [key in LanguageType]: string };

export type HTMLElementType = HTMLElementTagNameMap[keyof HTMLElementTagNameMap];

export class RichElement<T extends HTMLElementType> {
  el: T;
  i18n?: I18NConfig;

  constructor(el: T, i18n?: I18NConfig) {
    this.el = el;
    this.i18n = i18n;
  }

  set value(v: string) {
    (this.el as HTMLInputElement).value = v;
  }

  get value() {
    return (this.el as HTMLInputElement).value;
  }

  get files(): FileList | null {
    if (!(this.el instanceof HTMLInputElement)) {
      return null;
    }

    if (this.el.files === null || this.el.files.length === 0) {
      return null;
    }

    return this.el.files;
  }

  public appendChild(...richEls: RichElement<HTMLElementType>[]): RichElement<T> {
    for (const r of richEls) {
      this.el.appendChild(r.el);
    }
    return this;
  }

  public on<K extends keyof HTMLElementEventMap>(
    type: K,
    listener: EventListenerOrEventListenerObject,
    options?: boolean | AddEventListenerOptions
  ) {
    this.el.addEventListener(type, listener, options);
    return this;
  }
}

export type RichElementAttribute = {
  [k: string]: any;
  class?: string | string[];
  style?: string | { [k: string]: string };
};

export class TQueryResult extends Array {
  private on<K extends keyof HTMLElementEventMap>(
    type: K,
    listener: EventListenerOrEventListenerObject,
    options?: boolean | AddEventListenerOptions
  ) {
    this.forEach((richEl) => {
      richEl.on(type, listener, options);
    });
  }
}

export type TQuery = {
  (selectors: keyof HTMLElementTagNameMap | string): RichElement<HTMLElementType>[];
};
