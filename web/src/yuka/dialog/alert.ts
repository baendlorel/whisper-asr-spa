import { I18NConfig } from '..';
import { isDialogSupported, createDialog, DialogOption, normalize } from './common';

export function alert(message: string, options?: DialogOption): void;
export function alert(i18nConfig: I18NConfig, options?: DialogOption): void;
export function alert(options: DialogOption): void;
export function alert(arg1: string | I18NConfig | DialogOption, options?: DialogOption): void {
  if (isDialogSupported === false) {
    alert(arg1.toString());
    return;
  }
  const normalizedOpt = normalize(arg1, options);
  normalizedOpt.type = 'alert';
  createDialog(normalizedOpt);
}
