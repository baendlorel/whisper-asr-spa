import { i18n } from './modules/i18n';
import { reverseMap } from './modules/common';
import './css/style.css';
import typescriptLogo from './assets/typescript.svg';
import app from './app';

i18n.setReverseMap(reverseMap);

document.body.appendChild(app.el);

// document.querySelector<HTMLDivElement>('#app')!.innerHTML = `
//   <div>
//     <a href="https://www.typescriptlang.org/" target="_blank">
//       <img src="${typescriptLogo}" class="logo vanilla" alt="TypeScript logo" />
//     </a>
//     <h1>Vite + TypeScript</h1>
//     <div class="card">
//       <button id="counter" type="button"></button>
//     </div>
//     <p class="read-the-docs">
//       Click on the Vite and TypeScript logos to learn more
//     </p>
//   </div>
// `;
