import { HTMLElementType, I18NConfig, YukaElement, YukaElementAttribute, TQuery } from '../types';
import { i18n } from './i18n';

export const $: TQuery = Object.assign((selectors: keyof HTMLElementTagNameMap) => {
  return [...document.querySelectorAll(selectors)].map(
    (e) => reverseMap.get(e) || new YukaElement(e)
  );
});

/**
 * 反向映射
 */
export const reverseMap = new Map<HTMLElementType, YukaElement<HTMLElementType>>();

export const h = <TN extends keyof HTMLElementTagNameMap>(
  tagName: TN,
  attributes?: YukaElementAttribute | string | string[],
  i18nOrTextContent?: I18NConfig | string
): YukaElement<HTMLElementTagNameMap[TN]> => {
  const element: HTMLElementTagNameMap[TN] = document.createElement<typeof tagName>(tagName);

  if (typeof i18nOrTextContent === 'string') {
    element.textContent = i18nOrTextContent;
    i18nOrTextContent = undefined;
  }

  // 注册CSS类
  if (attributes) {
    if (typeof attributes === 'string' || Array.isArray(attributes)) {
      attributes = { class: attributes };
    }

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
          (element.style as any)[prop] = attributes.style[prop as any];
        }
      }
      delete attributes.style;
    }

    for (const key of Object.keys(attributes)) {
      element.setAttribute(key, attributes[key]);
    }
  }

  const yukaElement = new YukaElement<HTMLElementTagNameMap[TN]>(element, i18nOrTextContent);

  i18n.render(yukaElement);

  reverseMap.set(element, yukaElement);

  return yukaElement;
};

export const css = (selector: keyof HTMLElementTagNameMap | string, style: CSSStyleDeclaration) => {
  const c = new Proxy(
    {},
    {
      get(target, p) {},
      apply() {},
    }
  );

  return css;
};

document.createElement('div').style;
