import { i18n, I18NConfig } from '..';
import { isDialogSupported, createDialog, closeDialog, DialogOption, normalize } from './common';

/**
 * 根据配置弹出wait窗口，窗口是以DOM标签dialog制作的
 * wait窗口的文字默认居中显示
 * @param message 消息内容
 * @param until 如果是秒数，则等待这么多秒。如果是Promise，则等待这个Promise.finally触发
 * @param options 详细配置，根据TS类型提示进行配置即可
 * @returns Promise<void> 在返回Promise，当resolve时表示等待已经结束
 */
export async function wait(
  message: string,
  until: number | Promise<any>,
  options?: DialogOption
): Promise<void>;

/**
 * 根据配置弹出wait窗口，窗口是以DOM标签dialog制作的
 * wait窗口的文字默认居中显示
 * @param i18nConfig 多国语言的消息配置，会根据现在的语言环境自动显示对应文字
 * @param until 如果是秒数，则等待这么多秒。如果是Promise，则等待这个Promise.finally触发
 * @param options 详细配置，根据TS类型提示进行配置即可
 * @returns Promise<void> 在返回Promise，当resolve时表示等待已经结束
 */
export async function wait(
  i18nConfig: I18NConfig,
  until: number | Promise<any>,
  options?: DialogOption
): Promise<void>;

/**
 * 根据配置弹出wait窗口，窗口是以DOM标签dialog制作的
 * wait窗口的文字默认居中显示
 * @param until 如果是秒数，则等待这么多秒。如果是Promise，则等待这个Promise.finally触发
 * @param options 详细配置，根据TS类型提示进行配置即可
 * @returns Promise<void> 在返回Promise，当resolve时表示等待已经结束
 */
export async function wait(until: number | Promise<any>, options?: DialogOption): Promise<void>;

export async function wait(
  arg1: string | I18NConfig | number | Promise<any>,
  until?: number | Promise<any> | DialogOption,
  options?: DialogOption
): Promise<void> {
  return new Promise((resolve, reject) => {
    if (isDialogSupported === false) {
      reject('[Yuka:dialog wait] Dialog is not supported in this browser.');
    }

    // 此为参数归一化后通用的wait函数
    const _wait = (
      arg1: string | I18NConfig | undefined,
      until: number | Promise<any>,
      options?: DialogOption
    ) => {
      const normalizedOpt = normalize(arg1, options);
      normalizedOpt.type = 'wait';

      normalizedOpt.bodyStyle = Object.assign(
        {
          textAlign: 'center',
        },
        normalizedOpt.bodyStyle
      );

      normalizedOpt.titleStyle = Object.assign(
        {
          textAlign: 'center',
        },
        normalizedOpt.titleStyle
      );

      const { dialog, body, footer } = createDialog(normalizedOpt);
      footer.remove();

      if (typeof until === 'number') {
        let timeLeft = until;

        const countDownText = options?.countDownText;
        const refreshCountDown =
          body !== undefined && typeof countDownText === 'function'
            ? () => (body.textContent = countDownText(timeLeft))
            : () => void 0;

        // 先展示第一次的文本
        refreshCountDown();
        const counter = setInterval(() => {
          timeLeft--;
          refreshCountDown();
          if (timeLeft <= 0) {
            clearInterval(counter);
            closeDialog(dialog, options);
            resolve();
            return;
          }
        }, 1000);
      } else if (until instanceof Promise) {
        until.finally(() => {
          closeDialog(dialog, options);
          resolve();
        });
      }
    };

    // 开始检测参数是哪一种重载
    // 1. wait(message: string, until: number | Promise<any>, options?: DialogOption): void;
    if (typeof arg1 === 'string' && (typeof until === 'number' || until instanceof Promise)) {
      _wait(arg1, until, options);
      return;
    }

    // 2. wait(i18nConfig: I18NConfig, until: number | Promise<any>, options?: DialogOption): void;
    if (i18n.isValidConfig(arg1) && (typeof until === 'number' || until instanceof Promise)) {
      _wait(arg1 as I18NConfig, until, options);
      return;
    }

    // 3. wait(until: number | Promise<any>, options?: DialogOption): void;
    if (typeof arg1 === 'number' || arg1 instanceof Promise) {
      options = until as DialogOption;
      until = arg1 as number | Promise<any>;
      _wait(undefined, until, options);
      return;
    }

    reject('[Yuka:dialog wait] Invalid overload.');
  });
}
