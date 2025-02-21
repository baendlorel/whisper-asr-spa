import { dialog, i18n, useYuka } from './yuka';
import typescriptLogo from './assets/typescript.svg';
import locale from './components/locale';
import players from './components/players';
import audioForm from './components/audio-form';
import displayer from './components/displayer';

const { h } = useYuka();

const waitbtn = h(
  'button',
  {
    onclick: () =>
      dialog.wait({ zh: '等3秒', en: 'wait 3s' }, 3, {
        title: { zh: '等待测试', en: 'wait test' },
        onOpen() {
          console.time('dialog');
          console.timeLog('dialog', 'onOpen');
        },
        onOpened() {
          console.timeLog('dialog', 'onOpened');
        },
        onClose() {
          console.timeLog('dialog', 'onClose');
        },
        onClosed() {
          console.timeLog('dialog', 'onClosed');
          console.timeEnd('dialog');
        },
        async countDownText(timePast: number) {
          return {
            zh: `还剩${3 - timePast}秒，已经过去了${timePast}秒`,
            en: `left ${3 - timePast}s, passed ${timePast}s`,
          };
        },
      }),
  },
  'wait btn'
);

const promptbtn = h(
  'button',
  {
    onclick: () =>
      dialog.prompt(
        { zh: '输入校验码', en: 'Input check code' },
        {
          promptValidator(value) {
            if (value === '123') {
              return true;
            }

            return { zh: '校验码错误', en: 'Check code error' };
          },
          async onYes() {
            const a = Math.random();
            console.log('a', a);
            return a > 0.5;
          },
        }
      ),
  },
  'prompt btn'
);

export default h('div', { class: 'container' }).append(
  h('h2', { class: 'title' }).append(
    h('img', { src: typescriptLogo, class: 'logo' }),
    h('span', undefined, 'Whisper ASR')
  ),
  waitbtn,
  promptbtn,
  locale,
  displayer,
  players,
  audioForm
);
