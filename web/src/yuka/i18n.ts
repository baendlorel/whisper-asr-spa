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
    return (localStorage.getItem(i18n.UI_LANGUAGE) || i18n.DEFAULT_LANGUAGE) as LanguageType;
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

  get(i18nConfig: I18NConfig) {
    // 此处不进行isValid判定，因为理论上需要使用它的地方都是已经校验过的
    return i18nConfig[i18n.locale] || '';
  },

  isValidConfig(i18nConfig: any) {
    if (i18nConfig === null || typeof i18nConfig !== 'object') {
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
