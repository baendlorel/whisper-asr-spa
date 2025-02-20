import { i18n, I18NConfig } from '..';
import { createDialog, closeDialog, DialogOption, normalize, DialogController } from './common';

/**
 * 根据配置弹出wait窗口，窗口是以DOM标签dialog制作的
 * wait窗口的文字默认居中显示
 * @param message 消息内容
 * @param until 如果是秒数，则等待这么多秒。如果是Promise，则等待这个Promise.finally触发
 * @param options 详细配置，根据TS类型提示进行配置即可
 * @returns  DialogController<'wait'> 在返回Promise，当resolve时表示等待已经结束
 */
export function wait(
  message: string,
  until: number | Promise<any>,
  options?: DialogOption
): DialogController<'wait'>;

/**
 * 根据配置弹出wait窗口，窗口是以DOM标签dialog制作的
 * wait窗口的文字默认居中显示
 * @param i18nConfig 多国语言的消息配置，会根据现在的语言环境自动显示对应文字
 * @param until 如果是秒数，则等待这么多秒。如果是Promise，则等待这个Promise.finally触发
 * @param options 详细配置，根据TS类型提示进行配置即可
 * @returns  DialogController<'wait'> 在返回Promise，当resolve时表示等待已经结束
 */
export function wait(
  i18nConfig: I18NConfig,
  until: number | Promise<any>,
  options?: DialogOption
): DialogController<'wait'>;

/**
 * 根据配置弹出wait窗口，窗口是以DOM标签dialog制作的
 * wait窗口的文字默认居中显示
 * @param until 如果是秒数，则等待这么多秒。如果是Promise，则等待这个Promise.finally触发
 * @param options 详细配置，根据TS类型提示进行配置即可
 * @returns  DialogController<'wait'> 在返回Promise，当resolve时表示等待已经结束
 */
export function wait(
  until: number | Promise<any>,
  options?: DialogOption
): DialogController<'wait'>;

export function wait(
  arg1: string | I18NConfig | number | Promise<any>,
  until?: number | Promise<any> | DialogOption,
  options?: DialogOption
): DialogController<'wait'> {
  // 此为参数归一化后通用的wait函数
  const _wait = (
    arg1: string | I18NConfig | undefined,
    until: number | Promise<any>,
    options?: DialogOption
  ): DialogController<'wait'> => {
    const opt = normalize(arg1, options);
    opt.type = 'wait';
    opt.bodyStyle = Object.assign({ textAlign: 'center' }, opt.bodyStyle);
    opt.titleStyle = Object.assign({ textAlign: 'center' }, opt.titleStyle);
    const { dialog, body, footer } = createDialog(opt);
    // wait窗口不能点击退出，需要等待时机到了才能退出
    footer.remove();

    let timePast = 0;
    const countDownText = options?.countDownText;
    // 这里需要根据countDownText的返回值来重载refreshCountDown
    // 不能提前运行来检测返回值，以避免countDownText本身设置得不好造成额外影响
    let refreshCountDown =
      body === undefined || typeof countDownText !== 'function'
        ? () => undefined
        : () => {
            const returnValue = countDownText(timePast);

            if (typeof returnValue === 'string') {
              body.textContent = returnValue;
              refreshCountDown = () => (body.textContent = countDownText(timePast) as string);
              return;
            }

            if (i18n.isValidConfig(returnValue)) {
              body.textContent = i18n.get(returnValue as I18NConfig);
              refreshCountDown = () =>
                (body.textContent = i18n.get(countDownText(timePast) as I18NConfig));
              return;
            }

            if (returnValue instanceof Promise) {
              returnValue.then((v) => {
                if (typeof v === 'string') {
                  body.textContent = v;
                  refreshCountDown = () =>
                    (countDownText(timePast) as Promise<string>).then(
                      (t) => (body.textContent = t)
                    );
                  return;
                }

                if (i18n.isValidConfig(v)) {
                  body.textContent = i18n.get(v as I18NConfig);
                  refreshCountDown = () =>
                    (countDownText(timePast) as Promise<I18NConfig>).then(
                      (t) => (body.textContent = i18n.get(t))
                    );
                  return;
                }

                throw new Error(
                  '[Yuka:dialog wait.countDownText] countDownText must return a string/I18NConfig/Promise<string>/Promise<I18NConfig> .'
                );
              });
              return;
            }

            throw new Error(
              '[Yuka:dialog wait.countDownText] countDownText must return a string/I18NConfig/Promise<string>/Promise<I18NConfig> .'
            );
          };

    // 先展示第一次的文本，同时达到重载此函数的效果
    refreshCountDown();

    const result = new Promise((resolve) => {
      // 等待时间为秒数的情形
      if (typeof until === 'number') {
        const counter = setInterval(() => {
          timePast++;
          refreshCountDown();
          if (timePast >= until) {
            clearInterval(counter);
            closeDialog(dialog);
            resolve(timePast);
            return;
          }
        }, 1000);
      }
      // 等待给定的Promise完成的情形
      else if (until instanceof Promise) {
        const counter = setInterval(() => {
          timePast++;
          refreshCountDown();
        }, 1000);
        until.finally(() => {
          clearInterval(counter);
          closeDialog(dialog);
          resolve(timePast);
        });
      }
    }) as Promise<number>;

    return {
      result,
      then: result.then,
      close: () => closeDialog(dialog),
    };
  };

  // 开始检测参数是哪一种重载
  // 1. wait(message: string, until: number | Promise<any>, options?: DialogOption): void;
  if (typeof arg1 === 'string' && (typeof until === 'number' || until instanceof Promise)) {
    return _wait(arg1, until, options);
  }

  // 2. wait(i18nConfig: I18NConfig, until: number | Promise<any>, options?: DialogOption): void;
  if (i18n.isValidConfig(arg1) && (typeof until === 'number' || until instanceof Promise)) {
    return _wait(arg1 as I18NConfig, until, options);
  }

  // 3. wait(until: number | Promise<any>, options?: DialogOption): void;
  if (typeof arg1 === 'number' || arg1 instanceof Promise) {
    options = until as DialogOption;
    until = arg1 as number | Promise<any>;
    return _wait(undefined, until, options);
  }

  throw new Error('[Yuka:dialog wait] Invalid overload.');
}
