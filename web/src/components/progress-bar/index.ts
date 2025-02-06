import { YukaElement } from '../../types';
import { css, h } from '../../modules/common';
import style from './style.css?raw';

css(style);

export default () => {
  let progressBar: YukaElement<HTMLDivElement>;

  const component = h('div', 'progress-wrapper').appendChild(
    (progressBar = h('div', 'progress-bar'))
  );

  /**
   * 设置进度条百分比
   * @param percent 0~1之间的小数
   */
  const setProgress = (percent: number) => {
    const p = (percent * 100).toFixed(2) + '%';
    progressBar.style.width = p;
  };

  return {
    component,
    setProgress,
  };
};
