import { i18n, I18NConfig, Yuka } from '..';
import { createDialog, normalize, closeDialog, createFooterButtonClickHandler } from './common';
import {
  DialogBasicOption,
  DialogFooterOption,
  DialogYesOption,
  DialogController,
  DialogPromptInputOption,
  DialogOption,
} from './types';

type DialogPromptOption = Omit<
  Partial<DialogBasicOption & DialogFooterOption & DialogYesOption & DialogPromptInputOption>,
  'body'
>;

const createPrompt = (body: HTMLElement, options: DialogOption) => {
  if (options.type !== 'prompt') {
    return { label: undefined, input: undefined };
  }

  const promptLabel = document.createElement('label');
  const promptInputDiv = document.createElement('div');
  const promptInput = document.createElement('input');
  const promptFeedback = document.createElement('div');

  promptInput.type = 'text';
  if (typeof options.promptDefault === 'string') {
    promptInput.value = options.promptDefault;
  }

  promptFeedback.classList.add('feedback');
  promptInputDiv.style.display = 'grid';
  promptInputDiv.style.marginTop = '8px';
  promptInputDiv.style.gridTemplateColumns = '1fr';
  promptInputDiv.style.width = '100%';
  promptInputDiv.append(promptInput);
  body.append(promptLabel);
  body.append(promptInputDiv);
  body.append(promptFeedback);

  const result = {
    label: promptLabel as HTMLElement,
    input: promptInput,
    feedback: promptFeedback,
  };

  if (typeof options.promptLabel === 'string') {
    promptLabel.textContent = options.promptLabel;
    return result;
  }

  if (i18n.isValidConfig(options.promptLabel)) {
    promptLabel.textContent = i18n.get(options.promptLabel as I18NConfig);
    return result;
  }

  if (options.promptLabel instanceof HTMLElement) {
    promptLabel.replaceWith(options.promptLabel);
    result.label = options.promptLabel;
    return result;
  }

  if (options.promptLabel instanceof Yuka) {
    promptLabel.replaceWith(options.promptLabel.el);
    result.label = options.promptLabel.el;
    return result;
  }

  throw new Error("[Yuka:dialog appendPromptInput] options.promptLabel's type is invalid");
};

export function prompt(
  label: string | I18NConfig,
  options?: DialogPromptOption
): DialogController<'prompt'>;

export function prompt(
  label: string | I18NConfig,
  options?: DialogPromptOption
): DialogController<'prompt'> {
  const opt = normalize('prompt', label, options);
  const { dialog, body, yes } = createDialog<'prompt'>(opt);
  const prompt = createPrompt(body, opt);
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
