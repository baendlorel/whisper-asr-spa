import { alert } from './alert';
import { confirm } from './confirm';
import { prompt } from './prompt';
import { wait } from './wait';

export const dialog = Object.freeze({
  alert,
  confirm,
  wait,
  prompt,
});
