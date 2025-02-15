import { i18n } from '../i18n';
import { HTMLElementType, I18NConfig } from '../types';
import { Yuka } from '../yuka.class';

export type DialogOption = {
  title?: string | I18NConfig | HTMLElement | Yuka<HTMLElementType>;
  body?: string | I18NConfig | HTMLElement | Yuka<HTMLElementType>;
  footer?: HTMLElement | Yuka<HTMLElementType>;
  variant?: 'primary' | 'success' | 'danger' | 'warning' | 'info' | 'light' | 'dark';
  width?: string;
  onYes?: (event: Event) => void;
  onNo?: (event: Event) => void;
};

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

const createYesButton = (onclick?: (event: Event) => void) => {
  const b = document.createElement('button');
  b.textContent = { zh: '确定', en: 'Yes' }[i18n.locale];

  if (typeof onclick === 'function') {
    b.addEventListener('click', onclick);
  }
  return b;
};

const createNoButton = (onclick?: (event: Event) => void) => {
  const b = createYesButton(onclick);
  b.style.backgroundColor = '#F8F9FA';
  return b;
};

const applyTitle = (dialog: HTMLDialogElement, title: HTMLDivElement, options?: DialogOption) => {
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
    title.append(options.title);
    title.remove();
    return;
  }

  if (options.title instanceof Yuka) {
    title.append(options.title.el);
    title.remove();
    return;
  }

  throw new Error("[Yuka:dialog applyTitle] options.title's type is invalid");
};

const applyBody = (dialog: HTMLDialogElement, body: HTMLDivElement, options?: DialogOption) => {
  if (options === undefined || options.body === undefined) {
    body.remove();
    return;
  }

  if (typeof options.body === 'string') {
    body.textContent = options.body;
    return;
  }

  if (i18n.isValidConfig(options.body)) {
    body.textContent = (options.body as I18NConfig)[i18n.locale];
    return;
  }

  if (options.body instanceof HTMLElement) {
    body.append(options.body);
    body.remove();
    return;
  }

  if (options.body instanceof Yuka) {
    body.append(options.body.el);
    body.remove();
    return;
  }

  throw new Error("[Yuka:dialog applyBody] options.body's type is invalid");
};

const applyFooter = (dialog: HTMLDialogElement, footer: HTMLDivElement, options?: DialogOption) => {
  if (options === undefined || options.footer === undefined) {
    const onYes = () => {
      dialog.classList.remove('show');
      dialog.addEventListener('transitionend', (e: TransitionEvent) => {
        if (dialog.isSameNode(e.target as Node) && e.propertyName === 'opacity') {
          dialog.close();
          dialog.remove();
        }
      });
    };
    const yes = createYesButton(options?.onYes || onYes);
    footer.appendChild(yes);
    return;
  }

  const hasNoButton = (el: HTMLElement) => {
    const buttons = el.querySelectorAll('button,input[type=button]');
    return buttons.length === 0;
  };

  if (options.footer instanceof HTMLElement) {
    if (hasNoButton(options.footer)) {
      console.warn(
        "[Yuka:dialog applyFooter] options.footer doesn't have any button, there might be no way to close the dialog"
      );
    }
    footer.append(options.footer);
    footer.remove();
    return;
  }

  if (options.footer instanceof Yuka) {
    if (hasNoButton(options.footer.el)) {
      console.warn(
        "[Yuka:dialog applyFooter] options.footer doesn't have any button, there might be no way to close the dialog"
      );
    }
    footer.append(options.footer.el);
    footer.remove();
    return;
  }

  throw new Error("[Yuka:dialog applyFooter] options.footer's type is invalid");
};

const createDialog = (options?: DialogOption) => {
  const dialog = document.createElement('dialog');
  const title = document.createElement('div');
  const body = document.createElement('div');
  const footer = document.createElement('div');

  // 元素标签设置
  dialog.setAttribute('yk-role', 'dialog');
  title.setAttribute('yk-role', 'title');
  body.setAttribute('yk-role', 'body');
  footer.setAttribute('yk-role', 'footer');

  dialog.appendChild(title);
  dialog.appendChild(body);
  dialog.appendChild(footer);

  applyBody(dialog, body, options);
  applyTitle(dialog, title, options);
  applyFooter(dialog, footer, options);

  document.body.appendChild(dialog);

  dialog.showModal();
  dialog.classList.add('hide');

  requestAnimationFrame(() => {
    dialog.classList.add('show');
  });

  return { dialog, title, body, footer };
};

function alert(message: string, options?: DialogOption): void;
function alert(i18nConfig: I18NConfig, options?: DialogOption): void;
function alert(options: DialogOption): void;
function alert(arg1: string | I18NConfig | DialogOption, options?: DialogOption): void {
  if (isDialogSupported === false) {
    alert(arg1.toString());
    return;
  }

  // 只用message的
  if (typeof arg1 === 'string') {
    options = Object.assign(options || {}, { body: arg1 });
  }
  // 用i18nConfig的
  else if (i18n.isValidConfig(arg1)) {
    options = Object.assign(options || {}, { body: (arg1 as I18NConfig)[i18n.locale] });
  }
  // 直接用options的
  else {
    options = arg1 as DialogOption;
  }

  createDialog(options);
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
