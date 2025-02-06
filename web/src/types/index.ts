export const LanguageTypes = ['zh', 'en'] as const;

export type LanguageType = (typeof LanguageTypes)[number];

export type I18NConfig = { [key in LanguageType]: string };

export type HTMLElementType = HTMLElementTagNameMap[keyof HTMLElementTagNameMap];

const uidSymbol = Symbol('uid');
export class YukaElement<T extends HTMLElementType> {
  static [uidSymbol]: number = 0;
  uid: number;
  el: T;
  i18n?: I18NConfig;

  constructor(el: T, i18n?: I18NConfig) {
    this.uid = ++YukaElement[uidSymbol];
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

  appendChild(...yukaEls: YukaElement<HTMLElementType>[]): YukaElement<T> {
    for (const r of yukaEls) {
      this.el.appendChild(r.el);
    }
    return this;
  }

  on<K extends keyof HTMLElementEventMap>(
    type: K,
    listener: EventListenerOrEventListenerObject,
    options?: boolean | AddEventListenerOptions
  ) {
    this.el.addEventListener(type, listener, options);
    return this;
  }
}

export type YukaElementAttribute = {
  [k: string]: any;
  class?: string | string[];
  style?: string | CSSStyleDeclaration;
  scopedCss?: { [k: string]: string };
};

export type YukaCssCreator = (
  selector: keyof HTMLElementTagNameMap | string,
  style: CSSStyleDeclaration
) => YukaCssCreator;
