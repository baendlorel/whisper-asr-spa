import { HTMLElementType, I18NConfig, YukaElement, YukaElementAttribute } from '../types';
import { i18n } from './i18n';

// export const $: TQuery = Object.assign((selectors: keyof HTMLElementTagNameMap) => {
//   return [...document.querySelectorAll(selectors)].map(
//     (e) => reverseMap.get(e) || new YukaElement(e)
//   );
// });

/**
 * 反向映射
 */
export const reverseMap = new Map<HTMLElementType, YukaElement<HTMLElementType>>();

export const h = <TN extends keyof HTMLElementTagNameMap>(
  tagName: TN,
  attributes?: YukaElementAttribute | string | string[],
  i18nOrTextContent?: I18NConfig | string,
  scopeName?: string
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

  const yukaElement = new YukaElement<HTMLElementTagNameMap[TN]>(
    element,
    i18nOrTextContent,
    scopeName
  );

  i18n.render(yukaElement);

  reverseMap.set(element, yukaElement);

  return yukaElement;
};

let cssString: string[] = [];

// export const css: YukaCssCreator = (
//   selector: keyof HTMLElementTagNameMap | string,
//   style: Partial<CSSStyleDeclaration>
// ) => {
//   let str = '';

//   for (const [prop, s] of Object.entries(style)) {
//     str += `${prop.replace(/[A-Z]/g, (a) => '-' + a.toLowerCase())}:${s};`;
//   }

//   cssString.push(`${selector}{${str}}`);
//   return css;
// };

export const css = (cssText: string, scopeName?: string) => {
  const c =
    scopeName === undefined
      ? cssText
      : cssText
          .replace(/[\s]+\,/g, ',')
          .replace(/[\s]+\{/g, '{')
          .replace(/\,/g, `[${scopeName}],`)
          .replace(/\{/g, `[${scopeName}]{`);
  cssString.push(c);
  return css;
};

const DIC = 'abcdefhijkmnprstwxyz';
export const genScopeName = () => {
  return 'yuka-bbbbbbb'.replace(/bbbbbbb/g, () => DIC[Math.floor(Math.random() * DIC.length)]);
};

export const applyCss = () => {
  document.body.append(h('style', { yuka: 'saikou' }, cssString.join(' ')).el);
};

document.createElement('div').style;
