import { Yuka } from '@/yuka';
import { useYuka } from '@/yuka';
import style from './style.css?raw';

const { h, css } = useYuka();

css(style);

export default () => {
  let progressBar: Yuka<HTMLDivElement>;

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
