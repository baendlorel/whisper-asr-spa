import { HTMLElementType, I18NConfig, RichElement, RichElementAttribute, TQuery } from '../types';
import { i18n } from './i18n';

/**
 * 反向映射
 */
export const reverseMap = new Map<HTMLElementType, RichElement<HTMLElementType>>();

export const h = <TN extends keyof HTMLElementTagNameMap>(
  tagName: TN,
  attributes?: RichElementAttribute,
  i18nOrTextContent?: I18NConfig | string
): RichElement<HTMLElementTagNameMap[TN]> => {
  const element: HTMLElementTagNameMap[TN] = document.createElement<typeof tagName>(tagName);

  if (typeof i18nOrTextContent === 'string') {
    element.textContent = i18nOrTextContent;
    i18nOrTextContent = undefined;
  }

  // 注册CSS类
  if (attributes) {
    if (attributes.class) {
      if (Array.isArray(attributes.class)) {
        element.classList.add(...attributes.class);
      } else {
        element.className = attributes.class;
      }
      delete attributes.class;
    }

    // 注册样式
    if (attributes.style) {
      if (typeof attributes.style === 'string') {
        element.setAttribute('style', attributes.style);
      } else {
        for (const prop of Object.keys(attributes.style)) {
          (element.style as any)[prop] = attributes.style[prop];
        }
      }
      delete attributes.style;
    }

    for (const key of Object.keys(attributes)) {
      element.setAttribute(key, attributes[key]);
    }
  }

  const richElement = new RichElement<HTMLElementTagNameMap[TN]>(element, i18nOrTextContent);

  i18n.render(richElement);

  reverseMap.set(element, richElement);

  return richElement;
};

export const $: TQuery = Object.assign((selectors: keyof HTMLElementTagNameMap) => {
  return [...document.querySelectorAll(selectors)].map(
    (e) => reverseMap.get(e) || new RichElement(e)
  );
});
