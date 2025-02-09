import { I18NConfig } from './types';
import { Yuka, YukaAttribute } from './yuka.class';

export function _h<TN extends keyof HTMLElementTagNameMap>(
  tagName: TN,
  attr?: YukaAttribute | string,
  content?: I18NConfig | string,
  scopeName?: string
): Yuka<HTMLElementTagNameMap[TN]> {
  if (typeof tagName !== 'string') {
    throw new Error('[Yuka:h] tagName must be a string');
  }
  if (attr !== undefined && typeof attr !== 'string' && typeof attr !== 'object') {
    throw new Error('[Yuka:h] attributes must be a string or attribute object');
  }
  if (content !== undefined && typeof content !== 'string' && typeof content !== 'object') {
    throw new Error('[Yuka:h] content must be a string or I18NConfig object');
  }
  if (scopeName !== undefined && typeof scopeName !== 'string') {
    throw new Error('[Yuka:h] content must be a string or I18NConfig object');
  }

  const element: HTMLElementTagNameMap[TN] = document.createElement<typeof tagName>(tagName);

  if (typeof content === 'string') {
    element.textContent = content;
    content = undefined;
  }

  // 注册CSS类
  if (attr) {
    if (typeof attr === 'string' || Array.isArray(attr)) {
      attr = { class: attr };
    }

    if (attr.class) {
      if (Array.isArray(attr.class)) {
        element.classList.add(...attr.class);
      } else {
        element.className = attr.class;
      }
      delete attr.class;
    }

    // 注册样式
    if (attr.style) {
      if (typeof attr.style === 'string') {
        element.setAttribute('style', attr.style);
      } else {
        for (const [prop, style] of Object.entries(attr.style)) {
          (element.style as any)[prop] = style;
        }
      }
      delete attr.style;
    }

    for (const key of Object.keys(attr)) {
      element.setAttribute(key, attr[key]);
    }
  }

  if (scopeName !== undefined) {
    element.setAttribute(scopeName, '');
  }

  // 准备dom元素完成，剩下的处理在Yuka中完成，包括i18n的应用
  return new Yuka<HTMLElementTagNameMap[TN]>(element, content);
}
