import { i18n } from './i18n';
import { HTMLElementType, I18NConfig, LanguageTypes } from './types';

const uidSymbol = Symbol('uid');
const i18nSymbol = Symbol('i18n');

export class Yuka<T extends HTMLElementType> {
  static readonly reverseMap: Map<HTMLElementType, Yuka<HTMLElementType>> = new Map();
  static [uidSymbol]: number = 0;

  static refreshAllLocale() {
    Yuka.reverseMap.forEach((yukaEl) => yukaEl.applyLocale());
  }

  readonly uid: number;
  readonly el: T;
  [i18nSymbol]?: I18NConfig;

  constructor(el: T, i18nConfig?: I18NConfig) {
    if (el instanceof HTMLElement === false) {
      throw new Error('[Yuka:Yuka.constructor] el is not an HTMLElement');
    }
    if (i18nConfig !== undefined && !i18n.isValidConfig(i18nConfig)) {
      throw new Error('[Yuka:Yuka.constructor] i18nConfig not valid');
    }

    this.uid = ++Yuka[uidSymbol];
    this.el = el;
    this[i18nSymbol] = i18nConfig;

    this.applyLocale();
    Yuka.reverseMap.set(this.el, this);
  }

  get isYuka() {
    return true;
  }

  set i18n(i18nConfig: I18NConfig) {
    if (!i18n.isValidConfig(i18nConfig)) {
      throw new Error('[Yuka:Yuka.i18n] The given i18nConfig is not a valid config object.');
    }
    this[i18nSymbol] = i18nConfig;
    this.applyLocale();
  }

  get i18n(): I18NConfig | undefined {
    if (this[i18nSymbol] === undefined) {
      return undefined;
    }

    const i18nConfig = {} as I18NConfig;
    const thisArg = this;
    const currentI18NConfig = this[i18nSymbol];
    for (const key of LanguageTypes) {
      Object.defineProperty(i18nConfig, key, {
        get() {
          return currentI18NConfig[key];
        },
        set(newValue) {
          if (typeof newValue !== 'string') {
            throw new Error('[Yuka:Yuka.i18n] The given i18nConfig is not a valid config object.');
          }
          Reflect.set(currentI18NConfig, key, newValue);
          thisArg.applyLocale();
        },
      });
    }
    return i18nConfig;
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

  get textContent(): string | null {
    return this.el.textContent;
  }

  set textContent(text: string) {
    this.el.textContent = text;
  }

  get style() {
    return this.el.style;
  }

  appendChild(...yukaEls: Yuka<HTMLElementType>[]): Yuka<T> {
    for (const r of yukaEls) {
      this.el.appendChild(r.el);
    }
    return this;
  }

  remove() {
    // 此处的remove已经重写过了，会递归调用并删除reverseMap里的内容
    this.el.remove();
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

  applyLocale() {
    if (!this[i18nSymbol]) {
      return;
    }
    this.textContent = this[i18nSymbol][i18n.locale];
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
