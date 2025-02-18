import { I18NConfig } from '..';
import {
  isDialogSupported,
  createDialog,
  DialogOption,
  normalize,
  DIALOG_CONFIRM_ATTR,
} from './common';

/**
 * 根据配置弹出confirm窗口，窗口是以DOM标签dialog制作的
 * @param message 消息内容
 * @param options 可选的详细配置，根据TS类型提示进行配置即可
 * @returns 点击确认返回true，点击取消返回false
 */
export async function confirm(message: string, options?: DialogOption): Promise<boolean>;

/**
 * 根据配置弹出confirm窗口，窗口是以DOM标签dialog制作的
 * @param i18nConfig 多国语言的消息配置，会根据现在的语言环境自动显示对应文字
 * @param options 可选的详细配置，根据TS类型提示进行配置即可
 * @returns 点击确认返回true，点击取消返回false
 */
export async function confirm(i18nConfig: I18NConfig, options?: DialogOption): Promise<boolean>;

/**
 * 根据配置弹出confirm窗口，窗口是以DOM标签dialog制作的
 * @param options 直接使用详细配置，根据TS类型提示进行配置即可
 */
export async function confirm(options: DialogOption): Promise<boolean>;

export async function confirm(arg1: string | I18NConfig | DialogOption, options?: DialogOption) {
  if (isDialogSupported === false) {
    return confirm(arg1.toString());
  }

  const normalizedOpt = normalize(arg1, options);
  normalizedOpt.type = 'confirm';
  const { dialog } = createDialog(normalizedOpt);

  return new Promise((resolve) => {
    dialog.addEventListener('close', () => {
      const confirmResult = dialog.getAttribute(DIALOG_CONFIRM_ATTR);
      resolve(confirmResult === 'yes');
    });
  });
}
