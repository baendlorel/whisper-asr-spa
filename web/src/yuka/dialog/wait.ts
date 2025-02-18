import { i18n, I18NConfig } from '..';
import { isDialogSupported, createDialog, closeDialog, DialogOption, normalize } from './common';

export async function wait(
  message: string,
  until: number | Promise<any>,
  options?: DialogOption
): Promise<void>;
export async function wait(
  i18nConfig: I18NConfig,
  until: number | Promise<any>,
  options?: DialogOption
): Promise<void>;
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

    const _wait = (
      arg1: string | I18NConfig | undefined,
      until: number | Promise<any>,
      options?: DialogOption
    ) => {
      const normalizedOpt = normalize(arg1, options);
      normalizedOpt.type = 'wait';
      const { dialog, footer } = createDialog(normalizedOpt);
      footer.remove();

      if (typeof until === 'number') {
        setTimeout(() => {
          closeDialog(dialog);
          resolve();
        }, until * 1000);
      } else if (until instanceof Promise) {
        until.then(() => {
          closeDialog(dialog);
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
