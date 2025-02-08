import { i18n } from './i18n';
import { I18NConfig } from './types';
import { Yuka, YukaAttribute } from './yuka.class';

export function _h<TN extends keyof HTMLElementTagNameMap>(
  tagName: TN,
  attributes?: YukaAttribute | string,
  content?: I18NConfig | string,
  scopeName?: string
): Yuka<HTMLElementTagNameMap[TN]> {
  const element: HTMLElementTagNameMap[TN] = document.createElement<typeof tagName>(tagName);

  if (typeof content === 'string') {
    element.textContent = content;
    content = undefined;
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
        for (const [prop, style] of Object.entries(attributes.style)) {
          (element.style as any)[prop] = style;
        }
      }
      delete attributes.style;
    }

    for (const key of Object.keys(attributes)) {
      element.setAttribute(key, attributes[key]);
    }
  }

  if (scopeName !== undefined) {
    element.setAttribute(scopeName, '');
  }

  const yukaElement = new Yuka<HTMLElementTagNameMap[TN]>(element, content);

  i18n.render(yukaElement);

  return yukaElement;
}
