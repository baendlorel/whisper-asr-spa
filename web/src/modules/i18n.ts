import { HTMLElementType, LanguageType, LanguageTypes } from '../types';
import { reverseMap } from './common';

const UI_LANGUAGE = 'UI_LANGUAGE';
const DEFAULT_LANGUAGE: LanguageType = 'zh';

const init = () => {
  const lang = getCurrentUILanguage();
  render(lang);
};

const getCurrentUILanguage = (): LanguageType => {
  let lang = localStorage.getItem(UI_LANGUAGE) as LanguageType;
  if (!LanguageTypes.includes(lang)) {
    lang = DEFAULT_LANGUAGE;
  }
  return lang;
};

const setCurrentUILanguage = (lang: LanguageType) => {
  localStorage.setItem(UI_LANGUAGE, lang);
  render(lang);
};

const rerender = (node: ChildNode | HTMLElementType, newText: string) => {
  for (const localeText of Object.keys(i18n)) {
    if (node.textContent === localeText) {
      node.textContent = newText;
      return;
    }
  }
};

const render = (lang: LanguageType = DEFAULT_LANGUAGE) => {
  reverseMap.forEach(({ i18n }, element) => {
    if (i18n === undefined) {
      return;
    }

    const childs = element.childNodes;
    if (childs.length === 0) {
      rerender(element, i18n[lang]);
    } else {
      for (let j = 0; j < childs.length; j++) {
        rerender(childs[j], i18n[lang]);
      }
    }
  });
};

export const i18n = { init, setCurrentUILanguage };
