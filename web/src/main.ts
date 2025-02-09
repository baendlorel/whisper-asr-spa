// 引入样式
import './css/theme.css';
import './css/style.css';
import './css/radio.css';
import './css/ds-select.css';

// 引入模块
import { applyCss, setIcon } from './yuka';
import typescriptLogo from './assets/typescript.svg';
import app from './app';

setIcon(typescriptLogo);
applyCss();

app.mount(document.body);
