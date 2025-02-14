// 引入模块
import { applyCss, setIcon } from './yuka';
import typescriptLogo from './assets/typescript.svg';
import app from './app';

setIcon(typescriptLogo);
applyCss();

app.mount(document.body);
