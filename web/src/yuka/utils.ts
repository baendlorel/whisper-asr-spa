import { i18n } from './i18n';
import { I18NConfig } from './types';

export const promisify = <T>() => {};

/**
 * 自动读取string和I18NConfig的文本
 * @param t string或I18NConfig
 * @returns 如果不是这两者，那么返回false
 */
export const getText = (t: string | I18NConfig): string | false => {
  if (typeof t === 'string') {
    return t;
  }

  if (i18n.isValidConfig(t)) {
    return i18n.get(t);
  }

  return false;
};
