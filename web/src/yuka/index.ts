import { I18NConfig } from './types';
import { Yuka, YukaAttribute } from './yuka.class';
import { _h } from './h';
import { _css, applyCss } from './css';

/**
 * 将css样式应用到页面中
 * @param cssText css文本
 * @returns
 */
function css(cssText: string) {
  return _css(cssText);
}

/**
 * 创建Yuka元素，基本用法
 * @param tagName HTML元素标签
 * @param attributes 元素属性值
 * @param i18n 国际化的元素内容
 */

export function h<TN extends keyof HTMLElementTagNameMap>(
  tagName: TN,
  attributes?: YukaAttribute,
  i18n?: I18NConfig
): Yuka<HTMLElementTagNameMap[TN]>;

/**
 * 创建Yuka元素，基本用法
 * @param tagName HTML元素标签
 * @param attributes 元素属性值
 * @param textContent 元素文本内容
 */
export function h<TN extends keyof HTMLElementTagNameMap>(
  tagName: TN,
  attributes?: YukaAttribute,
  textContent?: string
): Yuka<HTMLElementTagNameMap[TN]>;

/**
 * 创建Yuka元素，最简写法
 * @param tagName HTML元素标签
 * @param classes 元素的类名或类名列表
 * @param i18n 国际化的元素内容
 */
export function h<TN extends keyof HTMLElementTagNameMap>(
  tagName: TN,
  classes?: string[] | string,
  i18n?: I18NConfig
): Yuka<HTMLElementTagNameMap[TN]>;

/**
 * 创建Yuka元素
 * @param tagName HTML元素标签
 * @param classes 元素的类名或类名列表
 * @param textContent 元素文本内容
 */
export function h<TN extends keyof HTMLElementTagNameMap>(
  tagName: TN,
  classes?: string[] | string,
  textContent?: string
): Yuka<HTMLElementTagNameMap[TN]>;

export function h<TN extends keyof HTMLElementTagNameMap>(
  tagName: TN,
  attributes?: YukaAttribute | string,
  content?: I18NConfig | string
) {
  return _h(tagName, attributes, content);
}

const useScope = () => {
  const scopeName = 'yuka-bbbbbbb'.replace(/b/g, () =>
    String.fromCharCode(97 + Math.floor(Math.random() * 26))
  );

  return {
    css: (cssText: string) => _css(cssText, scopeName),
    h: (a, b, c) => _h(a, b, c, scopeName),
  } as {
    css: typeof css;
    h: typeof h;
  };
};

export { css, applyCss, useScope, Yuka };
