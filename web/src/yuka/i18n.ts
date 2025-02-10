import { yukaEvent } from './event-bus';
import { I18NConfig, LanguageType, LanguageTypes } from './types';

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
    if (typeof lang !== 'string') {
      throw new Error('[Yuka:i18n.set locale] lang must be a string');
    }

    if (!LanguageTypes.includes(lang)) {
      console.warn(
        `[Yuka:i18n.set locale] lang '${lang}' is not in [${LanguageTypes.join()}], use default '${
          i18n.DEFAULT_LANGUAGE
        } instead.'`
      );
      lang = i18n.DEFAULT_LANGUAGE;
    }

    localStorage.setItem(i18n.UI_LANGUAGE, lang);
    yukaEvent.emitI18NUpdated();
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
