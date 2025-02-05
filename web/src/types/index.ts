export const LanguageTypes = ['zh', 'en'] as const;

export type LanguageType = (typeof LanguageTypes)[number];

export type I18NConfig = { [key in LanguageType]: string };

export type HTMLElementType = HTMLElementTagNameMap[keyof HTMLElementTagNameMap];

export type RichElement<T extends HTMLElementType> = {
  readonly files: FileList | null;
  el: T;
  i18n?: I18NConfig;
  value: string;
  appendChild: (...richEls: RichElement<HTMLElementType>[]) => RichElement<T>;
  on: <K extends keyof HTMLElementEventMap>(
    type: K,
    listener: EventListenerOrEventListenerObject,
    options?: boolean | AddEventListenerOptions
  ) => void;
};

export type RichElementAttribute = {
  [k: string]: any;
  class?: string | string[];
  style?: string | { [k: string]: string };
};

export type CreateElementFunction = <T extends keyof HTMLElementTagNameMap>(
  tagName: T,
  attributes?: RichElementAttribute,
  i18n?: I18NConfig
) => RichElement<HTMLElementTagNameMap[T]>;

export type TQuery = {
  (selectors: keyof HTMLElementTagNameMap): NodeListOf<HTMLElementType>;
};
