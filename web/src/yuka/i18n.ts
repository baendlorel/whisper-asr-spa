import { yukaEvent } from './event-bus';
import { I18NConfig, LanguageType, LanguageTypes } from './types';

const UI_LANGUAGE = 'UI_LANGUAGE';
const DEFAULT_LANGUAGE = 'zh' as LanguageType;

export const i18n = {
  get locale() {
    return (localStorage.getItem(UI_LANGUAGE) || DEFAULT_LANGUAGE) as LanguageType;
  },

  set locale(lang: LanguageType) {
    if (typeof lang !== 'string') {
      throw new Error('[Yuka:i18n.set locale] lang must be a string');
    }

    if (!LanguageTypes.includes(lang)) {
      console.warn(
        `[Yuka:i18n.set locale] lang '${lang}' is not in [${LanguageTypes.join()}], use default '${DEFAULT_LANGUAGE} instead.'`
      );
      lang = DEFAULT_LANGUAGE;
    }

    localStorage.setItem(UI_LANGUAGE, lang);

    yukaEvent.emitI18NUpdated();
  },

  get: (i18nConfig: I18NConfig) => {
    // 此处不进行isValid判定，因为理论上需要使用它的地方都是已经校验过的
    return i18nConfig[i18n.locale] || '';
  },

  valid: (i18nConfig: any) => {
    if (!i18nConfig || typeof i18nConfig !== 'object') {
      return false;
    }

    // 只要有一个配置符合条件就可以
    for (const key of LanguageTypes) {
      if (typeof i18nConfig[key] === 'string') {
        return true;
      }
    }

    return false;
  },
};
