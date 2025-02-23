import { dialog, i18n, LanguageTypes, useYuka } from '@/yuka';
import { memoize } from '@/yuka/utils';

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
  'wait'
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
  'prompt'
);

const alertbtn = h(
  'button',
  {
    onclick: () => dialog.alert({ zh: '输入校验码', en: 'Input check code' }),
  },
  'alert'
);

// * 经测试，memoize对i18n.valid的优化效果为负。100万次守卫代码比正向判定略微慢十几毫秒，不做更改
const memoizei18nbtn = h(
  'button',
  {
    onclick: () => {
      const originValid = (i18nConfig: any) => {
        if (!i18nConfig || typeof i18nConfig !== 'object') {
          return false;
        }

        // 只要有一个配置符合条件就可以
        for (const key of LanguageTypes) {
          if (typeof i18nConfig[key] === 'string') {
            return true;
          }
        }

        return false;
      };

      const COUNT = 1000000;
      console.log(`do ${COUNT} times`);

      console.time('pure get i18n');
      const pureGet = (i18nConfig: any) => i18nConfig[i18n.locale];
      const conf = { zh: '中文', en: 'English' };
      for (let i = 0; i < COUNT; i++) {
        let a = pureGet(conf);
      }
      console.timeEnd('pure get i18n');

      console.time('origini18n');
      for (let i = 0; i < COUNT; i++) {
        if (originValid(conf)) {
          let a = pureGet(conf);
        }
      }
      console.timeEnd('origini18n');

      console.time('memoizei18n');
      const valid = memoize(originValid);
      for (let i = 0; i < COUNT; i++) {
        if (valid(conf)) {
          let a = pureGet(conf);
        }
      }
      console.timeEnd('memoizei18n');

      console.time('current');
      for (let i = 0; i < COUNT; i++) {
        let a = i18n.get(conf);
      }
      console.timeEnd('current');
    },
  },
  'memoizei18n'
);

export default h('div', {
  style: {
    display: 'grid',
    margin: '5px 0px',
    gridTemplateColumns: 'repeat(10, 1fr)',
    columnGap: '10px',
  },
}).append(waitbtn, promptbtn, alertbtn, memoizei18nbtn);
