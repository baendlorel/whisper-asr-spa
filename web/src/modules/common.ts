import { HTMLElementType, I18NConfig, RichElement, RichElementAttribute, TQuery } from '../types';

/**
 * 反向映射
 */
export const reverseMap = new Map<HTMLElementType, RichElement<HTMLElementType>>();

export const h = <TN extends keyof HTMLElementTagNameMap>(
  tagName: TN,
  attributes?: RichElementAttribute,
  i18n?: I18NConfig
): RichElement<HTMLElementTagNameMap[TN]> => {
  const element: HTMLElementTagNameMap[TN] = document.createElement<typeof tagName>(tagName);

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

  const richElement: RichElement<HTMLElementTagNameMap[TN]> = {
    el: element,
    i18n,
    on: element.addEventListener,
    appendChild: (...richEls: RichElement<HTMLElementType>[]) => {
      for (const r of richEls) {
        richElement.el.appendChild(r.el);
      }
      return richElement;
    },
    set value(v: string) {
      (element as any).value = v;
    },
    get value() {
      return (element as any).value;
    },
    get files() {
      if (!(element instanceof HTMLInputElement)) {
        return null;
      }

      if (element.files === null || element.files.length === 0) {
        return null;
      }

      return element.files;
    },
  };

  reverseMap.set(element, richElement);

  return richElement;
};

export const $: TQuery = Object.assign((selectors: keyof HTMLElementTagNameMap) => {
  return document.querySelectorAll(selectors);
});
