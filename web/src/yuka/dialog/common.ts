import { i18n, Yuka, I18NConfig } from '..';
import { DialogOption, DialogOptionExt } from './types';

export const isDialogSupported = ((supported) => {
  if (supported) {
    console.error('[Yuka:dialog] dialog is not supported in this browser!');
  }
  return supported;
})(typeof document.createElement('dialog').showModal === 'function');

export const DIALOG_CONFIRM_ATTR = 'yk-confirm';

const DIALOG_ROLE = 'yk-role';

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

const DialogState = {
  ATTR_NAME: 'yk-state',
  OPENED: 'opened',
  OPENING: 'opening',
  CLOSING: 'closing',
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

const applyStyle = (el: HTMLElement, style: Partial<CSSStyleDeclaration>) => {
  for (const k in style) {
    if (style.hasOwnProperty(k)) {
      (el.style as any)[k] = style[k];
    }
  }
};

const applyTitle = (dialog: HTMLDialogElement, title: HTMLElement, options: DialogOptionExt) => {
  if (options.title === undefined || options.title === null) {
    title.remove();
    return { title: undefined };
  }

  if (options.titleStyle && typeof options === 'object') {
    applyStyle(title, options.titleStyle);
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

  if (options.bodyStyle && typeof options === 'object') {
    applyStyle(body, options.bodyStyle);
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

  if (options.footerStyle && typeof options === 'object') {
    applyStyle(footer, options.footerStyle);
  }

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

export const normalize = (arg1?: string | I18NConfig | DialogOption, options?: DialogOption) => {
  if ((arg1 === undefined || arg1 === null) && (options === undefined || options === null)) {
    throw new Error('[Yuka:dialog normalize] arg1 and options cannot be both undefined/null.');
  }

  if (typeof arg1 !== 'string' && typeof arg1 !== 'object') {
    throw new Error('[Yuka:dialog normalize] arg1 must be a string or an i18nConfig object.');
  }
  if (options !== undefined && options !== null && typeof options !== 'object') {
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

export const closeDialog = (dialog: HTMLDialogElement) => {
  dialog.setAttribute(DialogState.ATTR_NAME, DialogState.CLOSING);
  dialog.classList.remove('show');
};

const openDialog = (dialog: HTMLDialogElement) => {
  dialog.setAttribute(DialogState.ATTR_NAME, DialogState.OPENING);
  dialog.classList.add('show');
};

export const createDialog = (options: DialogOptionExt) => {
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

  if (options.dialogStyle && typeof options === 'object') {
    applyStyle(dialog, options.dialogStyle);
  }

  document.body.appendChild(dialog);

  dialog.showModal();

  const compare = (state: string, targetOpacity: string) => {
    const isRightState = dialog.getAttribute(DialogState.ATTR_NAME) === state;
    const elOpacity = Number(getComputedStyle(dialog).opacity);
    const opacity = Number(targetOpacity);
    return isRightState && Math.abs(elOpacity - opacity) < 0.06;
  };

  dialog.addEventListener('transitionstart', (e: TransitionEvent) => {
    // 确定是dialog元素、确定转换的属性是opacity、确定不是dialog的backdrop在重复触发事件
    if (dialog !== (e.target as Node) || e.propertyName !== 'opacity' || e.pseudoElement !== '') {
      return;
    }

    // 检测opacity从0向1变化，触发onOpen
    if (compare(DialogState.OPENING, '0')) {
      typeof options.onOpen === 'function' && options.onOpen();
    }

    // 检测opacity从1向0变化，触发onClose
    if (compare(DialogState.CLOSING, '1')) {
      typeof options.onClose === 'function' && options.onClose();
    }
  });

  dialog.addEventListener('transitionend', (e: TransitionEvent) => {
    // 确定是dialog元素、确定转换的属性是opacity、确定不是dialog的backdrop在重复触发事件
    if (dialog !== (e.target as Node) || e.propertyName !== 'opacity' || e.pseudoElement !== '') {
      return;
    }

    if (compare(DialogState.OPENING, '1')) {
      dialog.setAttribute(DialogState.ATTR_NAME, DialogState.OPENED);
      typeof options.onOpened === 'function' && options.onOpened();
    }

    if (compare(DialogState.CLOSING, '0')) {
      typeof options.onClosed === 'function' && options.onClosed();
      dialog.close();

      // 延迟删除，防止触发的close事件取不到dialog
      setTimeout(() => {
        dialog.remove();
      }, 1000);
    }
  });

  openDialog(dialog);
  return { dialog, title, body, footer, yes, no };
};
