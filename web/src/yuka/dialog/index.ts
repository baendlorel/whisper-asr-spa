import { i18n } from '../i18n';
import { HTMLElementType, I18NConfig } from '../types';
import { Yuka } from '../yuka.class';

const isDialogSupported = (() => {
  const dialog = document.createElement('dialog');
  return typeof dialog.showModal === 'function';
})();

const DEFAULT_YES_I18N: I18NConfig = {
  zh: '确定',
  en: 'Yes',
};

const DEFAULT_NO_I18N: I18NConfig = {
  zh: '取消',
  en: 'No',
};

const createDialog = () => {
  const dialog = document.createElement('dialog');
  const title = document.createElement('div');
  const body = document.createElement('div');
  const footer = document.createElement('div');

  // 元素标签设置
  dialog.setAttribute('yk-role', 'dialog');
  title.setAttribute('yk-role', 'title');
  body.setAttribute('yk-role', 'body');
  footer.setAttribute('yk-role', 'footer');

  // 统一padding
  title.style.padding = '5px 12px';
  body.style.padding = '5px 12px';
  footer.style.padding = '5px 12px';

  // 文字样式
  title.style.fontWeight = 'bold';
  title.style.fontSize = '1.2em';

  // footer右对齐
  footer.style.textAlign = 'right';

  // dialog本体样式
  dialog.style.boxShadow = '1px 1px 5px 2px rgba(0, 0, 0, .2);';
  dialog.style.border = '0';
  dialog.style.borderRadius = '5px';
  dialog.style.padding = '10px 12px';
  dialog.style.width = '420px';

  dialog.appendChild(title);
  dialog.appendChild(body);
  dialog.appendChild(footer);
  document.body.appendChild(dialog);

  return { dialog, title, body, footer };
};

export type DialogOption = {
  title?: string | I18NConfig | HTMLElement | Yuka<HTMLElementType>;
  body?: string | I18NConfig | HTMLElement | Yuka<HTMLElementType>;
  footer?: string | HTMLElement | Yuka<HTMLElementType>;
  variant?: 'primary' | 'success' | 'danger' | 'warning' | 'info' | 'light' | 'dark';
  width?: string;
};

const getDialogOption = (options?: DialogOption) => {
  const { title, body, footer, variant, width } = options || {};
  return { title, body, footer, variant, width };
};

const applyTitle = (title: HTMLDivElement, options?: DialogOption) => {
  if (options === undefined || options.title === undefined) {
    title.remove();
    return;
  }

  if (typeof options.title === 'string') {
    title.textContent = options.title;
    return;
  }

  if (i18n.isValidConfig(options.title)) {
    title.textContent = (options.title as I18NConfig)[i18n.locale];
    return;
  }

  if (options.title instanceof HTMLElement) {
    title.outerHTML = options.title.outerHTML;
    return;
  }

  if (options.title instanceof Yuka) {
    title.outerHTML = options.title.el.outerHTML;
    return;
  }
};

const applyBody = (body: HTMLDivElement, options?: DialogOption) => {};

function alert(message: string, options?: DialogOption): HTMLDialogElement;
function alert(i18nConfig: I18NConfig, options?: DialogOption): HTMLDialogElement;
function alert(options: DialogOption): HTMLDialogElement;
function alert(
  arg1: string | I18NConfig | DialogOption,
  options?: DialogOption
): HTMLDialogElement {
  const { dialog, title, body, footer } = createDialog();
  let message: string;
  let i18nConfig: I18NConfig;
  // 只用message的
  if (typeof arg1 === 'string') {
    message = arg1;
    body.textContent = message;
    applyTitle(title, options);
  }
  // 用i18nConfig的
  else if (i18n.isValidConfig(arg1)) {
    i18nConfig = arg1 as I18NConfig;
    message = i18nConfig[i18n.locale];
  }
  // 直接用options的
  else {
    options = arg1 as DialogOption;
  }

  const yes = document.createElement('button');
  yes.style.padding = '8px 16px';
  yes.style.border = '1px solid #ccc';
  yes.style.borderRadius = '5px';
  yes.style.background = '#f8f9fa';

  footer.appendChild(yes);

  yes.addEventListener('click', () => {
    dialog.close();
    dialog.remove();
  });

  dialog.showModal();

  return dialog;
}

export const dialog = {
  alert,
  confirm: async (message: string, options?: { yesText: I18NConfig; noText: I18NConfig }) => {
    const { yesText = DEFAULT_YES_I18N, noText = DEFAULT_NO_I18N } = options || {
      yesText: DEFAULT_YES_I18N,
      noText: DEFAULT_NO_I18N,
    };
    const d = document.createElement('dialog');
    const p = document.createElement('p');
    p.textContent = message;
    const yes = document.createElement('button');
    const no = document.createElement('button');
    yes.textContent = yesText[i18n.locale];
    no.textContent = noText[i18n.locale];
    d.appendChild(p);
    d.appendChild(yes);
    d.appendChild(no);

    d.showModal();
    return new Promise((resolve) => {
      yes.addEventListener('click', () => {
        d.remove();
        resolve(true);
      });
      no.addEventListener('click', () => {
        d.remove();
        resolve(false);
      });
    });
  },
};
