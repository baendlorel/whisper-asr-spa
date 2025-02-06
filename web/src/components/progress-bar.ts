import { YukaElement } from '../types';
import { h } from '../modules/common';

export default () => {
  let progressBar: YukaElement<HTMLDivElement>;
  let progressLabel: YukaElement<HTMLLabelElement>;

  const component = h('div', 'progress-wrapper').appendChild(
    (progressBar = h('div', 'progress-bar')).appendChild(
      (progressLabel = h('label', { class: 'progress-label' }, '0%'))
    )
  );

  /**
   * 设置进度条百分比
   * @param percent 0~1之间的小数
   */
  const setProgress = (percent: number) => {
    const p = (percent * 100).toFixed(2) + '%';
    progressBar.el.style.width = p;
    progressLabel.el.textContent = p;
  };

  return {
    component,
    setProgress,
  };
};
