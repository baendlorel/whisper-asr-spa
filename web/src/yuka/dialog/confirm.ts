import { I18NConfig } from '..';
import {
  isDialogSupported,
  createDialog,
  DialogOption,
  normalize,
  DIALOG_CONFIRM_ATTR,
} from './common';

export async function confirm(message: string, options?: DialogOption): Promise<boolean>;
export async function confirm(i18nConfig: I18NConfig, options?: DialogOption): Promise<boolean>;
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
