import { i18n, I18NConfig } from '..';
import { createDialog, normalize, closeDialog, createFooterButtonClickHandler } from './common';
import {
  DialogBasicOption,
  DialogFooterOption,
  DialogYesOption,
  DialogController,
  DialogPromptInputOption,
} from './types';

type DialogPromptOption = Omit<
  Partial<DialogBasicOption & DialogFooterOption & DialogYesOption & DialogPromptInputOption>,
  'body'
>;

export function prompt(
  label: string | I18NConfig,
  options?: DialogPromptOption
): DialogController<'prompt'>;

export function prompt(
  label: string | I18NConfig,
  options?: DialogPromptOption
): DialogController<'prompt'> {
  const opt = normalize('prompt', label, options);

  const { dialog, prompt, yes } = createDialog(opt);
  const newYes = yes.cloneNode(true) as HTMLButtonElement;
  const yesThenClose = createFooterButtonClickHandler(dialog, opt.onYes, 'yes');
  yes.replaceWith(newYes);

  // 这里要使得onYes在validator之后再执行，导致onYes的执行时机不确定
  const result = new Promise((resolve) => {
    newYes.addEventListener('click', () => {
      if (
        prompt.label === undefined ||
        prompt.input === undefined ||
        prompt.feedback === undefined
      ) {
        throw new Error('[Yuka:dialog prompt] Prompt elements is missing');
      }

      // 没有设置validator，直接关闭窗口，resolve输入框的值
      if (typeof opt.promptValidator !== 'function') {
        yesThenClose().then(() => resolve(prompt.input.value));
        return;
      }

      // 清空输入框的invalid样式和报错信息
      prompt.input.classList.remove('invalid');
      prompt.feedback.textContent = '';

      // 如果有validator，就先执行validator
      const isValid = Promise.resolve(opt.promptValidator(prompt.input.value));
      isValid.then((valid) => {
        // 校验通过，直接关闭窗口，resolve输入框的值
        if (valid === true) {
          yesThenClose().then(() => resolve(prompt.input.value));
          return;
        }

        prompt.input.classList.add('invalid');

        if (typeof valid === 'string') {
          prompt.feedback.textContent = valid;
          return;
        }
        if (i18n.isValidConfig(valid)) {
          prompt.feedback.textContent = i18n.get(valid);
          return;
        }

        throw new Error(
          '[Yuka:dialog prompt] Invalid promptValidator return value, must be a string/true/I18NConfig or Promised these types.'
        );
      });
    });
  }) as Promise<string>;

  return {
    result,
    then: result.then,
    close: () => closeDialog(dialog),
  };
}
