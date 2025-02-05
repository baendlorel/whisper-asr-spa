import { HTMLElementType, I18nElement } from '../types';

/**
 * 反向映射
 */
const reverseMap = new Map<HTMLElementType, I18nElement<HTMLElementType>>();

const h = function <T extends keyof HTMLElementTagNameMap>(
  tagName: T,
  attributes: { [key: string]: string } | null | undefined,
  i18n: {
    en: '';
    zh: '';
  }
) {
  const element: HTMLElementTagNameMap[T] = document.createElement<typeof tagName>(tagName);

  if (attributes) {
    for (const key of Object.keys(attributes)) {
      element.setAttribute(key, attributes[key]);
    }
  }

  const i18nElement: I18nElement<HTMLElementTagNameMap[T]> = {
    element,
    i18n,
    render: () => {},
  };

  reverseMap.set(element, i18nElement);

  return i18nElement;
};

const $ = (selectors: keyof HTMLElementTagNameMap) => {
  return document.querySelectorAll(selectors);
};

Object.defineProperty($, 'h', { value: h });

export { $ };
