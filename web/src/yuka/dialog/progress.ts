import { i18n, I18NConfig } from '..';
import { createDialog, closeDialog, normalize } from './common';
import { BasicOption, ProgressOption, DialogController } from './types';

type DialogProgressOption = Partial<BasicOption & ProgressOption>;

/**
 * 根据配置弹出wait窗口，窗口是以DOM标签dialog制作的
 * wait窗口的文字默认居中显示
 * @param i18nConfig 多国语言的消息配置，会根据现在的语言环境自动显示对应文字
 * @param until 如果是秒数，则等待这么多秒。如果是Promise，则等待这个Promise.finally触发
 * @param options 详细配置，根据TS类型提示进行配置即可
 * @returns  DialogController<'wait'> 在返回Promise，当resolve时表示等待已经结束
 */
export function progress(options?: DialogProgressOption): DialogController<'progress'>;
export function progress(options?: DialogProgressOption): DialogController<'progress'> {
  return {} as any;
}
