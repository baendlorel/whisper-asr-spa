import { i18n, I18NConfig } from '..';
import { createDialog, closeDialog, normalize } from './misc/common';
import { BasicOption, ProgressOption, DialogController } from './misc/types';

type DialogProgressOption = Partial<BasicOption & ProgressOption>;

/**
 * 根据配置弹出progress窗口，窗口是以DOM标签dialog制作的
 * progress窗口的文字默认居中显示
 * @param percentageGetter 获取百分比用的函数，会经常调用它以刷新显示的百分比
 * @param options 详细配置，根据TS类型提示进行配置即可
 * @returns  DialogController<'progress'> 在返回Promise，当resolve时表示进度条已达到100%
 */
export function progress(
  percentageGetter: () => number,
  options?: DialogProgressOption
): DialogController<'progress'>;

export function progress(
  percentageGetter: () => number,
  options?: DialogProgressOption
): DialogController<'progress'> {
  const opt = normalize('progress', undefined, options);
  // progress标题样式默认文字居中
  opt.titleStyle = Object.assign({ textAlign: 'center' }, opt.titleStyle);
  const { dialog, body } = createDialog<'progress'>(opt);

  const _runner = () => {
    const p = percentageGetter();
    if (p >= 1) {
      return;
    }

    requestAnimationFrame(_runner);
  };

  return {} as any;
}
