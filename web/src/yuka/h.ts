import { reverseMap } from '.';
import { i18n } from './i18n';
import { I18NConfig } from './types';
import { YukaElement, YukaElementAttribute } from './yuka-element.class';

/**
 * 创建Yuka元素，基本用法
 * @param tagName HTML元素标签
 * @param attributes 元素属性值
 * @param i18n 国际化的元素内容
 * @param scopeName 设置scope用以让css样式仅作用于特定组件
 */
export function h<TN extends keyof HTMLElementTagNameMap>(
  tagName: TN,
  attributes?: YukaElementAttribute,
  i18n?: I18NConfig,
  scopeName?: string
): YukaElement<HTMLElementTagNameMap[TN]>;

/**
 * 创建Yuka元素，基本用法
 * @param tagName HTML元素标签
 * @param attributes 元素属性值
 * @param textContent 元素文本内容
 * @param scopeName 设置scope用以让css样式仅作用于特定组件
 */
export function h<TN extends keyof HTMLElementTagNameMap>(
  tagName: TN,
  attributes?: YukaElementAttribute,
  textContent?: string,
  scopeName?: string
): YukaElement<HTMLElementTagNameMap[TN]>;

/**
 * 创建Yuka元素，最简写法
 * @param tagName HTML元素标签
 * @param classes 元素的类名或类名列表
 * @param i18n 国际化的元素内容
 * @param scopeName 设置scope用以让css样式仅作用于特定组件
 */
export function h<TN extends keyof HTMLElementTagNameMap>(
  tagName: TN,
  classes?: string[] | string,
  i18n?: I18NConfig,
  scopeName?: string
): YukaElement<HTMLElementTagNameMap[TN]>;

/**
 * 创建Yuka元素
 * @param tagName HTML元素标签
 * @param classes 元素的类名或类名列表
 * @param textContent 元素文本内容
 * @param scopeName 设置scope用以让css样式仅作用于特定组件
 */
export function h<TN extends keyof HTMLElementTagNameMap>(
  tagName: TN,
  classes?: string[] | string,
  textContent?: string,
  scopeName?: string
): YukaElement<HTMLElementTagNameMap[TN]>;

export function h<TN extends keyof HTMLElementTagNameMap>(
  tagName: TN,
  attributes?: YukaElementAttribute | string,
  content?: I18NConfig | string,
  scopeName?: string
): YukaElement<HTMLElementTagNameMap[TN]> {
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

  const yukaElement = new YukaElement<HTMLElementTagNameMap[TN]>(element, content, scopeName);

  i18n.render(yukaElement);

  reverseMap.set(element, yukaElement);

  return yukaElement;
}
