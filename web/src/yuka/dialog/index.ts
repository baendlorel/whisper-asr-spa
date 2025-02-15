import { i18n } from '../i18n';
import { HTMLElementType, I18NConfig } from '../types';
import { Yuka } from '../yuka.class';

export type DialogOption = {
  title?: string | I18NConfig | HTMLElement | Yuka<HTMLElementType>;
  body?: string | I18NConfig | HTMLElement | Yuka<HTMLElementType>;
  variant?: 'primary' | 'success' | 'danger' | 'warning' | 'info' | 'light' | 'dark';
  width?: string;
  yesText?: string | I18NConfig;
  noText?: string | I18NConfig;
  onYes?: () => void;
  onNo?: () => void;
  onOpen?: () => void;
  onClose?: () => void;
};

type DialogOptionExt = DialogOption & { type: 'alert' | 'confirm' };

const isDialogSupported = (() => {
  const dialog = document.createElement('dialog');
  return typeof dialog.showModal === 'function';
})();

const DEFAULT_FOOTER_BUTTON_I18N = {
  yes: {
    zh: '确定',
    en: 'Yes',
  },
  no: {
    zh: '取消',
    en: 'No',
  },
};

const DIALOG_CONFIRM_ATTR = 'yk-confirm';
const DIALOG_ROLE = 'yk-role';

const normalize = (arg1: string | I18NConfig | DialogOption, options?: DialogOption) => {
  if (typeof arg1 !== 'string' && typeof arg1 !== 'object' && !arg1) {
    throw new Error('[Yuka:dialog normalize] arg1 must be a string or an i18nConfig object.');
  }
  if (options && typeof options !== 'object') {
    throw new Error('[Yuka:dialog normalize] options must be a DialogOption object.');
  }

  // 只用message的
  if (typeof arg1 === 'string') {
    options = Object.assign(options || {}, { body: arg1 });
  }
  // 用i18nConfig的
  else if (i18n.isValidConfig(arg1)) {
    options = Object.assign(options || {}, { body: i18n.get(arg1 as I18NConfig) });
  }
  // 直接用options的
  else {
    options = arg1 as DialogOption;
  }
  return options as DialogOptionExt;
};

const createFooterButton = (options: DialogOptionExt, type: 'yes' | 'no') => {
  const b = document.createElement('button');
  const i18nKey = type === 'yes' ? 'yesText' : 'noText';
  const content = options[i18nKey] as I18NConfig;

  // 填充按钮文字
  if (typeof content === 'string') {
    b.textContent = content;
  } else if (i18n.isValidConfig(content)) {
    b.textContent = i18n.get(content);
  } else {
    b.textContent = i18n.get(DEFAULT_FOOTER_BUTTON_I18N[type]);
  }

  // 设置样式
  if (type === 'no') {
    b.style.backgroundColor = '#F8F9FA';
    b.style.color = 'black';
    b.style.marginRight = '8px';
  }

  return b;
};

const closeDialog = (dialog: HTMLDialogElement) => {
  dialog.classList.remove('show');
  dialog.addEventListener('transitionend', (e: TransitionEvent) => {
    if (dialog === (e.target as Node) && e.propertyName === 'opacity') {
      dialog.close();
      dialog.remove();
    }
  });
};

const applyTitle = (dialog: HTMLDialogElement, title: HTMLElement, options: DialogOptionExt) => {
  if (options.title === undefined) {
    title.remove();
    return { title: undefined };
  }

  if (options.variant) {
    title.classList.add(`bg-${options.variant}`);
  }

  if (typeof options.title === 'string') {
    title.textContent = options.title;
    return { title };
  }

  if (i18n.isValidConfig(options.title)) {
    title.textContent = i18n.get(options.title as I18NConfig);
    return { title };
  }

  if (options.title instanceof HTMLElement) {
    title.append(options.title);
    title.remove();
    return { title: options.title };
  }

  if (options.title instanceof Yuka) {
    title.append(options.title.el);
    title.remove();
    return { title: options.title.el };
  }

  throw new Error("[Yuka:dialog applyTitle] options.title's type is invalid");
};

const applyBody = (dialog: HTMLDialogElement, body: HTMLElement, options: DialogOptionExt) => {
  if (options.body === undefined) {
    body.remove();
    return { body: undefined };
  }

  if (typeof options.body === 'string') {
    body.textContent = options.body;
    return { body };
  }

  if (i18n.isValidConfig(options.body)) {
    body.textContent = i18n.get(options.body as I18NConfig);
    return { body };
  }

  if (options.body instanceof HTMLElement) {
    body.append(options.body);
    body.remove();
    return { body: options.body };
  }

  if (options.body instanceof Yuka) {
    body.append(options.body.el);
    body.remove();
    return { body: options.body.el };
  }

  throw new Error("[Yuka:dialog applyBody] options.body's type is invalid");
};

/**
 * 在没有footer的情况下会根据type的不同创建默认的确认按钮和取消按钮
 * 如果onYes、onNo事件返回值为false，则会阻止dialog关闭
 * @param dialog 对话框
 * @param footer 对话框的底部
 * @param options 扩展type后的配置
 * @returns
 */
const applyFooter = (dialog: HTMLDialogElement, footer: HTMLElement, options: DialogOptionExt) => {
  // 创建yes按钮的事件并绑定
  const createHandler =
    (handler: ((event: Event) => void) | undefined, type: 'yes' | 'no') => (e: Event) => {
      if (typeof handler !== 'function') {
        dialog.setAttribute(DIALOG_CONFIRM_ATTR, type);
        closeDialog(dialog);
        return;
      }
      const returnValue = handler(e) as Promise<any> | any;
      if (returnValue instanceof Promise) {
        returnValue.then((result) => {
          if (result !== false) {
            dialog.setAttribute(DIALOG_CONFIRM_ATTR, type);
            closeDialog(dialog);
          }
        });
        return;
      } else if (returnValue !== false) {
        dialog.setAttribute(DIALOG_CONFIRM_ATTR, type);
        closeDialog(dialog);
        return;
      }
    };

  const yes = createFooterButton(options, 'yes');
  const no = createFooterButton(options, 'no');
  yes.addEventListener('click', createHandler(options.onYes, 'yes'));
  no.addEventListener('click', createHandler(options.onNo, 'no'));

  if (options.type === 'alert') {
    footer.appendChild(yes);
  }

  if (options.type === 'confirm') {
    footer.appendChild(no);
    footer.appendChild(yes);
  }

  return { footer, yes, no };

  // * 不再允许使用options.footer
  // const hasNoButton = (el: HTMLElement) => {
  //   const buttons = el.querySelectorAll('button,input[type=button]');
  //   return buttons.length === 0;
  // };

  // if (options.footer instanceof HTMLElement) {
  //   if (hasNoButton(options.footer)) {
  //     console.warn(
  //       "[Yuka:dialog applyFooter] options.footer doesn't have any button, there might be no way to close the dialog"
  //     );
  //   }
  //   footer.append(options.footer);
  //   footer.remove();
  //   return { footer: options.footer };
  // }

  // if (options.footer instanceof Yuka) {
  //   if (hasNoButton(options.footer.el)) {
  //     console.warn(
  //       "[Yuka:dialog applyFooter] options.footer doesn't have any button, there might be no way to close the dialog"
  //     );
  //   }
  //   footer.append(options.footer.el);
  //   footer.remove();
  //   return { footer: options.footer.el };
  // }

  // throw new Error("[Yuka:dialog applyFooter] options.footer's type is invalid");
};

const createDialog = (options: DialogOptionExt) => {
  const dialog = document.createElement('dialog');
  const rawTitle = document.createElement('div');
  const rawBody = document.createElement('div');
  const rawFooter = document.createElement('div');

  // 元素标签设置
  dialog.setAttribute(DIALOG_ROLE, 'dialog');
  rawTitle.setAttribute(DIALOG_ROLE, 'title');
  rawBody.setAttribute(DIALOG_ROLE, 'body');
  rawFooter.setAttribute(DIALOG_ROLE, 'footer');

  dialog.appendChild(rawTitle);
  dialog.appendChild(rawBody);
  dialog.appendChild(rawFooter);

  const { body } = applyBody(dialog, rawBody, options);
  const { title } = applyTitle(dialog, rawTitle, options);
  const { footer, yes, no } = applyFooter(dialog, rawFooter, options);

  document.body.appendChild(dialog);

  dialog.showModal();

  if (typeof options.onOpen === 'function') {
    options.onOpen();
  }

  if (typeof options.onClose === 'function') {
    dialog.addEventListener('close', options.onClose);
  }

  requestAnimationFrame(() => {
    dialog.classList.add('show');
  });

  return { dialog, title, body, footer, yes, no };
};

function alert(message: string, options?: DialogOption): void;
function alert(i18nConfig: I18NConfig, options?: DialogOption): void;
function alert(options: DialogOption): void;
function alert(arg1: string | I18NConfig | DialogOption, options?: DialogOption): void {
  if (isDialogSupported === false) {
    alert(arg1.toString());
    return;
  }
  const normalizedOpt = normalize(arg1, options);
  normalizedOpt.type = 'alert';
  createDialog(normalizedOpt);
}

async function confirm(message: string, options?: DialogOption): Promise<boolean>;
async function confirm(i18nConfig: I18NConfig, options?: DialogOption): Promise<boolean>;
async function confirm(options: DialogOption): Promise<boolean>;
async function confirm(arg1: string | I18NConfig | DialogOption, options?: DialogOption) {
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

export const dialog = {
  alert,
  confirm,
};
