import { HTMLElementType, I18NConfig } from './types';

const uidSymbol = Symbol('uid');
export class Yuka<T extends HTMLElementType> {
  static readonly reverseMap: Map<HTMLElementType, Yuka<HTMLElementType>> = new Map();
  static [uidSymbol]: number = 0;

  uid: number;
  el: T;
  scopeName?: string;
  i18n?: I18NConfig;

  constructor(el: T, i18n?: I18NConfig, scopeName?: string) {
    this.uid = ++Yuka[uidSymbol];
    this.el = el;
    this.i18n = i18n;
    this.scopeName = scopeName;
    Yuka.reverseMap.set(this.el, this);
  }

  get isYuka() {
    return true;
  }

  //#region 模拟HTML元素的函数和变量

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

  get textContext(): string | null {
    return this.el.textContent;
  }

  set textContext(text: string) {
    this.el.textContent = text;
  }

  get style() {
    return this.el.style;
  }

  // scopeSpread(scopeName?: string) {
  //   // 已有scope就不用改了
  //   if (this.scopeName || scopeName === undefined) {
  //     return;
  //   }
  //   this.scopeName = scopeName;
  //   this.el.setAttribute(scopeName, '');
  // }

  appendChild(...yukaEls: Yuka<HTMLElementType>[]): Yuka<T> {
    for (const r of yukaEls) {
      this.el.appendChild(r.el);
      // r.scopeSpread(this.scopeName);
    }
    return this;
  }

  //#endregion

  on<K extends keyof HTMLElementEventMap>(
    type: K,
    listener: EventListenerOrEventListenerObject,
    options?: boolean | AddEventListenerOptions
  ) {
    this.el.addEventListener(type, listener, options);
    return this;
  }

  mount(element: Yuka<HTMLElementType>): void;

  mount(yukaElement: HTMLElement): void;

  mount(element: Yuka<HTMLElementType> | HTMLElement) {
    if (element instanceof Yuka) {
      element.appendChild(this);
    } else {
      element.appendChild(this.el);
    }
  }
}

export type YukaAttribute = {
  [k: string]: any;
  id?: string;
  for?: string;
  name?: string;
  value?: string;
  min?: string;
  max?: string;
  selected?: string;
  checked?: string;
  class?: string | string[];
  style?: string | Partial<CSSStyleDeclaration>;
};
