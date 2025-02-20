import { I18NConfig } from '..';
import { createDialog, DialogOption, normalize, closeDialog, DialogController } from './common';

/**
 * 根据配置弹出alert窗口，窗口是以DOM标签dialog制作的
 * @param message 消息内容
 * @param options 可选的详细配置，根据TS类型提示进行配置即可
 */
export function alert(message: string, options?: DialogOption): DialogController<'alert'>;

/**
 * 根据配置弹出alert窗口，窗口是以DOM标签dialog制作的
 * @param i18nConfig 多国语言的消息配置，会根据现在的语言环境自动显示对应文字
 * @param options 可选的详细配置，根据TS类型提示进行配置即可
 */
export function alert(i18nConfig: I18NConfig, options?: DialogOption): DialogController<'alert'>;

/**
 * 根据配置弹出alert窗口，窗口是以DOM标签dialog制作的
 * @param options 直接使用详细配置，根据TS类型提示进行配置即可
 */
export function alert(options: DialogOption): DialogController<'alert'>;

export function alert(
  arg1: string | I18NConfig | DialogOption,
  options?: DialogOption
): DialogController<'alert'> {
  const normalizedOpt = normalize(arg1, options);
  normalizedOpt.type = 'alert';
  const { dialog, yes } = createDialog(normalizedOpt);

  const result = new Promise((resolve) => {
    yes.addEventListener('click', () => {
      resolve();
    });
  }) as Promise<void>;

  return {
    result,
    then: result.then,
    close: () => closeDialog(dialog),
  };
}
