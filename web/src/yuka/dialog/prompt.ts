// TODO
import { HTMLElementType, I18NConfig, Yuka } from '..';
import { createDialog, normalize, closeDialog } from './common';
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

  // 这里要使得onYes在validator之后再执行，导致onYes的执行时机不确定
  const result = new Promise((resolve) => {
    yes.addEventListener('click', () => {
      if (prompt.input === undefined) {
        throw new Error('[Yuka:dialog prompt] Prompt input is missing');
      }
      resolve(prompt.input.value);
    });
  }) as Promise<string>;

  return {
    result,
    then: result.then,
    close: () => closeDialog(dialog),
  };
}
