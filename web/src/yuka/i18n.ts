import { I18NConfig, LanguageType, LanguageTypes } from './types';

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
export const i18n = {
  get UI_LANGUAGE() {
    return 'UI_LANGUAGE';
  },

  get DEFAULT_LANGUAGE() {
    return 'zh' as LanguageType;
  },

  get locale() {
    let lang = localStorage.getItem(i18n.UI_LANGUAGE) as LanguageType;
    if (!LanguageTypes.includes(lang)) {
      lang = i18n.DEFAULT_LANGUAGE;
    }
    return lang;
  },

  set locale(lang: LanguageType) {
    localStorage.setItem(i18n.UI_LANGUAGE, lang);
  },

  isValidConfig(i18nConfig: I18NConfig) {
    if (i18nConfig === null || typeof i18nConfig !== 'object') {
      return false;
    }
    for (const key of LanguageTypes) {
      if (typeof i18nConfig[key] !== 'string') {
        return false;
      }
    }
    return true;
  },
};
