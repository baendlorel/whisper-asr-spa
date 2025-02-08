import { HTMLElementType, LanguageType, LanguageTypes } from './types';
import { YukaElement } from './yuka-element.class';

// const rerender = (node: ChildNode | HTMLElementType, newText: string) => {
//   for (const localeText of Object.keys(i18n)) {
//     if (node.textContent === localeText) {
//       node.textContent = newText;
//       return;
//     }
//   }
// };

// const render = (lang: LanguageType = DEFAULT_LANGUAGE) => {
//   reverseMap.forEach(({ i18n }, element) => {
//     if (i18n === undefined) {
//       return;
//     }
//     const childs = element.childNodes;
//     if (childs.length === 0) {
//       rerender(element, i18n[lang]);
//     } else {
//       for (let j = 0; j < childs.length; j++) {
//         rerender(childs[j], i18n[lang]);
//       }
//     }
//   });
// };

class I18N {
  static readonly UI_LANGUAGE = 'UI_LANGUAGE';
  static readonly DEFAULT_LANGUAGE: LanguageType = 'zh';

  private reverseMap: Map<HTMLElementType, YukaElement<HTMLElementType>>;

  constructor() {
    this.reverseMap = new Map();
  }

  get locale() {
    let lang = localStorage.getItem(I18N.UI_LANGUAGE) as LanguageType;
    if (!LanguageTypes.includes(lang)) {
      lang = I18N.DEFAULT_LANGUAGE;
    }
    return lang;
  }

  set locale(lang: LanguageType) {
    localStorage.setItem(I18N.UI_LANGUAGE, lang);
    this.renderAll();
  }

  public setReverseMap(r: Map<HTMLElementType, YukaElement<HTMLElementType>>) {
    this.reverseMap = r;
  }

  public render(r: YukaElement<HTMLElementType>, locale?: LanguageType) {
    if (r.i18n === undefined) {
      return;
    }
    r.el.textContent = r.i18n[locale || this.locale];
  }

  private renderAll() {
    const lang = this.locale;
    this.reverseMap.forEach((r) => this.render(r, lang));
  }
}

export const i18n = new I18N();
