import { HTMLElementType, I18NConfig } from './types';
import { YukaElement, YukaElementAttribute } from './yuka-element.class';
import { i18n } from './i18n';

/**
 * 反向映射
 */
export const reverseMap = new Map<HTMLElementType, YukaElement<HTMLElementType>>();
