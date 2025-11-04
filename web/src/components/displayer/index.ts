import { div } from 'kt.js';
import { css } from '@emotion/css';
import { bus } from '@/lib/bus';

export const displayer = div({
  class: css`
    display: none;
    padding: 5px 10px;
    border: 1px solid rgb(192, 192, 192);
    border-radius: var(--border-radius);
    background-color: 1px solid rgb(225, 225, 225);
  `,
});

bus.on('display-result', (data: any) => (displayer.textContent = data.toString()));
