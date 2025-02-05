export type HTMLElementType = HTMLElementTagNameMap[keyof HTMLElementTagNameMap];

export type I18nElement<T extends HTMLElementType> = {
  element: T;
  i18n: {
    en: string;
    zh: string;
  };
  render: () => void;
};
