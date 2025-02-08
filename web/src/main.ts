// 引入样式
import './css/theme.css';
import './css/style.css';
import './css/radio.css';
import './css/ds-select.css';

// 引入模块
import { i18n } from './yuka/i18n';
import { applyCss, h, reverseMap } from './yuka';
import typescriptLogo from './assets/typescript.svg';
import app from './app';

i18n.setReverseMap(reverseMap);

h('link', { rel: 'icon', type: 'image/svg+xml', href: typescriptLogo }).mount(document.head);

app.mount(document.body);

applyCss();
