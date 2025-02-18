import { I18NConfig } from '..';
import { isDialogSupported, createDialog, DialogOption, normalize } from './common';

/**
 * 根据配置弹出alert窗口，窗口是以DOM标签dialog制作的
 * @param message 消息内容
 * @param options 可选的详细配置，根据TS类型提示进行配置即可
 */
export function alert(message: string, options?: DialogOption): void;

/**
 * 根据配置弹出alert窗口，窗口是以DOM标签dialog制作的
 * @param i18nConfig 多国语言的消息配置，会根据现在的语言环境自动显示对应文字
 * @param options 可选的详细配置，根据TS类型提示进行配置即可
 */
export function alert(i18nConfig: I18NConfig, options?: DialogOption): void;

/**
 * 根据配置弹出alert窗口，窗口是以DOM标签dialog制作的
 * @param options 直接使用详细配置，根据TS类型提示进行配置即可
 */
export function alert(options: DialogOption): void;

export function alert(arg1: string | I18NConfig | DialogOption, options?: DialogOption): void {
  if (isDialogSupported === false) {
    alert(arg1.toString());
    return;
  }
  const normalizedOpt = normalize(arg1, options);
  normalizedOpt.type = 'alert';
  createDialog(normalizedOpt);
}
