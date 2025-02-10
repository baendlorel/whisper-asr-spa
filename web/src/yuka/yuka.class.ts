import { yukaEvent } from './event-bus';
import { i18n } from './i18n';
import { HTMLElementType, I18NConfig, LanguageTypes } from './types';

const uidSymbol = Symbol('uid');
const i18nSymbol = Symbol('i18n');
const textNodeSymbol = Symbol('textNode');

yukaEvent.onI18NUpdated(() => Yuka.reverseMap.forEach((yukaEl) => yukaEl.applyLocale()));

export class Yuka<T extends HTMLElementType> {
  static readonly reverseMap: Map<HTMLElementType, Yuka<HTMLElementType>> = new Map();
  static [uidSymbol]: number = 0;

  readonly uid: number;
  readonly el: T;
  readonly [textNodeSymbol]: Node;
  [i18nSymbol]?: I18NConfig;

  constructor(el: T, textNode: Node, i18nConfig?: I18NConfig) {
    if (el instanceof HTMLElement === false) {
      throw new Error('[Yuka:Yuka.constructor] el is not an HTMLElement');
    }
    if (textNode instanceof Node === false || textNode.nodeType !== Node.TEXT_NODE) {
      throw new Error('[Yuka:Yuka.constructor] textNode is not an Node or TEXT_NODE');
    }
    if (textNode.parentElement !== el) {
      throw new Error('[Yuka:Yuka.constructor] textNode must be a child of el');
    }
    if (i18nConfig !== undefined && !i18n.isValidConfig(i18nConfig)) {
      throw new Error('[Yuka:Yuka.constructor] i18nConfig not valid');
    }

    this.uid = ++Yuka[uidSymbol];
    this.el = el;
    this[textNodeSymbol] = textNode;
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
    if (typeof v !== 'string') {
      throw new Error('[Yuka:Yuka.set value] Value must be a string');
    }
    (this.el as HTMLInputElement).value = v;
  }

  get value() {
    return (this.el as HTMLInputElement).value;
  }

  set checked(v: boolean) {
    (this.el as HTMLInputElement).checked = Boolean(v);
  }

  get checked() {
    return (this.el as HTMLInputElement).checked;
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

  get text(): string | null {
    return this[textNodeSymbol].textContent;
  }

  set text(text: string) {
    this[textNodeSymbol].textContent = text;
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
    this[textNodeSymbol].textContent = this[i18nSymbol][i18n.locale];
  }
}

export type YukaAttribute = {
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
} & {
  [k in string]: any;
} & {
  onabort?: (event: UIEvent) => void;
  onanimationcancel?: (event: AnimationEvent) => void;
  onanimationend?: (event: AnimationEvent) => void;
  onanimationiteration?: (event: AnimationEvent) => void;
  onanimationstart?: (event: AnimationEvent) => void;
  onauxclick?: (event: MouseEvent) => void;
  onbeforeinput?: (event: InputEvent) => void;
  onbeforetoggle?: (event: Event) => void;
  onblur?: (event: FocusEvent) => void;
  oncancel?: (event: Event) => void;
  oncanplay?: (event: Event) => void;
  oncanplaythrough?: (event: Event) => void;
  onchange?: (event: Event) => void;
  onclick?: (event: MouseEvent) => void;
  onclose?: (event: Event) => void;
  oncontextlost?: (event: Event) => void;
  oncontextmenu?: (event: MouseEvent) => void;
  oncontextrestored?: (event: Event) => void;
  oncopy?: (event: ClipboardEvent) => void;
  oncuechange?: (event: Event) => void;
  oncut?: (event: ClipboardEvent) => void;
  ondblclick?: (event: MouseEvent) => void;
  ondrag?: (event: DragEvent) => void;
  ondragend?: (event: DragEvent) => void;
  ondragenter?: (event: DragEvent) => void;
  ondragleave?: (event: DragEvent) => void;
  ondragover?: (event: DragEvent) => void;
  ondragstart?: (event: DragEvent) => void;
  ondrop?: (event: DragEvent) => void;
  ondurationchange?: (event: Event) => void;
  onemptied?: (event: Event) => void;
  onended?: (event: Event) => void;
  onerror?: (event: ErrorEvent) => void;
  onfocus?: (event: FocusEvent) => void;
  onformdata?: (event: FormDataEvent) => void;
  ongotpointercapture?: (event: PointerEvent) => void;
  oninput?: (event: Event) => void;
  oninvalid?: (event: Event) => void;
  onkeydown?: (event: KeyboardEvent) => void;
  onkeypress?: (event: KeyboardEvent) => void;
  onkeyup?: (event: KeyboardEvent) => void;
  onload?: (event: Event) => void;
  onloadeddata?: (event: Event) => void;
  onloadedmetadata?: (event: Event) => void;
  onloadstart?: (event: Event) => void;
  onlostpointercapture?: (event: PointerEvent) => void;
  onmousedown?: (event: MouseEvent) => void;
  onmouseenter?: (event: MouseEvent) => void;
  onmouseleave?: (event: MouseEvent) => void;
  onmousemove?: (event: MouseEvent) => void;
  onmouseout?: (event: MouseEvent) => void;
  onmouseover?: (event: MouseEvent) => void;
  onmouseup?: (event: MouseEvent) => void;
  onpaste?: (event: ClipboardEvent) => void;
  onpause?: (event: Event) => void;
  onplay?: (event: Event) => void;
  onplaying?: (event: Event) => void;
  onpointercancel?: (event: PointerEvent) => void;
  onpointerdown?: (event: PointerEvent) => void;
  onpointerenter?: (event: PointerEvent) => void;
  onpointerleave?: (event: PointerEvent) => void;
  onpointermove?: (event: PointerEvent) => void;
  onpointerout?: (event: PointerEvent) => void;
  onpointerover?: (event: PointerEvent) => void;
  onpointerup?: (event: PointerEvent) => void;
  onprogress?: (event: ProgressEvent) => void;
  onratechange?: (event: Event) => void;
  onreset?: (event: Event) => void;
  onresize?: (event: UIEvent) => void;
  onscroll?: (event: Event) => void;
  onscrollend?: (event: Event) => void;
  onsecuritypolicyviolation?: (event: SecurityPolicyViolationEvent) => void;
  onseeked?: (event: Event) => void;
  onseeking?: (event: Event) => void;
  onselect?: (event: Event) => void;
  onselectionchange?: (event: Event) => void;
  onselectstart?: (event: Event) => void;
  onslotchange?: (event: Event) => void;
  onstalled?: (event: Event) => void;
  onsubmit?: (event: SubmitEvent) => void;
  onsuspend?: (event: Event) => void;
  ontimeupdate?: (event: Event) => void;
  ontoggle?: (event: Event) => void;
  ontouchcancel?: (event: TouchEvent) => void;
  ontouchend?: (event: TouchEvent) => void;
  ontouchmove?: (event: TouchEvent) => void;
  ontouchstart?: (event: TouchEvent) => void;
  ontransitioncancel?: (event: TransitionEvent) => void;
  ontransitionend?: (event: TransitionEvent) => void;
  ontransitionrun?: (event: TransitionEvent) => void;
  ontransitionstart?: (event: TransitionEvent) => void;
  onvolumechange?: (event: Event) => void;
  onwaiting?: (event: Event) => void;
  onwheel?: (event: WheelEvent) => void;
};
document.body.onclick;
