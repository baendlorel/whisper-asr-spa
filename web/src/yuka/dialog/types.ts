import { I18NConfig, HTMLElementType, Yuka } from '..';

export type DialogBasicOption = {
  /**
   * 对话框的标题，
   */
  title: string | I18NConfig | HTMLElement | Yuka<HTMLElementType>;

  /**
   *  对话框的内容，可以是字符串、i18n配置、HTMLElement、Yuka实例
   */
  body: string | I18NConfig | HTMLElement | Yuka<HTMLElementType>;

  /**
   * 对话框的类型，会影响title的配色
   */
  variant: 'primary' | 'success' | 'danger' | 'warning' | 'info' | 'light' | 'dark';

  /**
   * 对话框的宽度，直接设置到dialog.style.width上
   */
  width: string;

  /**
   * 对话框样式
   */
  dialogStyle: Partial<CSSStyleDeclaration>;

  /**
   * 标题样式
   */
  titleStyle: Partial<CSSStyleDeclaration>;

  /**
   * 内容样式
   */
  bodyStyle: Partial<CSSStyleDeclaration>;

  /**
   * 对话框开启时，还在渐变的时候触发
   */
  onOpen: () => void;

  /**
   * 对话框开启完成，渐变结束时触发
   */
  onOpened: () => void;

  /**
   * 对话框开始关闭时触发
   */
  onClose: () => void;

  /**
   * 对话框关闭完成时触发
   */
  onClosed: () => void;
};

export type DialogFooterOption = {
  /**
   * 底部样式
   */
  footerStyle: Partial<CSSStyleDeclaration>;
};

export type DialogYesOption = {
  /**
   * 确认按钮的文本，可以是字符串或i18n配置，在alert和confirm中会用到
   * @function alert,confirm
   */
  yesText: string | I18NConfig;

  /**
   * 按下确认时绑定的事件
   * @returns 返回false/Promise<false>可以阻止dialog关闭
   */
  onYes: () => any;
};

export type DialogNoOption = {
  /**
   * 取消按钮的文本，可以是字符串或i18n配置，在confirm中会用到
   * @function confirm
   */
  noText: string | I18NConfig;

  /**
   * 按下取消时绑定的事件
   * @returns 返回false/Promise<false>可以阻止dialog关闭
   */
  onNo: () => any;
};

export type DialogCountDownOption = {
  /**
   * 在对话框中显示包含剩余时间的字符串，会覆盖message或i18n配置。支持Promise但不推荐使用
   * @param timeLeft 剩余时间，可制作倒计时
   * @returns
   */
  countDownText: (timePast: number) => string | I18NConfig | Promise<string> | Promise<I18NConfig>;
};

export type DialogPromptInputOption = {
  /**
   * 输入框的标签
   */
  promptLabel: string | I18NConfig | HTMLElement | Yuka<HTMLElementType>;

  /**
   * 输入框的默认值
   */
  promptDefault: string | I18NConfig;

  /**
   * 输入框的检测器，支持Promise但不推荐
   * 只有返回值是true或Promisetrue时，才算通过检测。如果返回string，则会作为错误信息展示在输入框下面
   */
  promptValidator: (value: string) => (true | string) | Promise<true | string>;
};

type DialogFullOption = DialogBasicOption &
  DialogFooterOption &
  DialogYesOption &
  DialogNoOption &
  DialogCountDownOption &
  DialogPromptInputOption;

export type DialogType = 'alert' | 'confirm' | 'wait' | 'prompt' | 'progress';

export type DialogOption = Partial<DialogFullOption> & { type: DialogType };

type DialogReturnType = {
  alert: void;
  confirm: boolean;
  wait: number;
  progress: void;
  prompt: string;
};

export type DialogController<T extends DialogType> = {
  /**
   * 表示对话框的结果，如果是alert则为Promise<void>，如果是confirm则为true/false
   */
  result: Promise<DialogReturnType[T]>;

  /**
   * 链接了result的Promise.then，方便直接使用
   */
  then: (onFulfilled: (value: DialogReturnType[T]) => any) => Promise<any>;

  /**
   * 谨慎使用！强制关闭对话框，可能会导致confirm.result的Promise永远不会resolve
   */
  close: () => void;
};
