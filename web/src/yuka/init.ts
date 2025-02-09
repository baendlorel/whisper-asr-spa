import { Yuka } from './yuka.class';

(() => {
  const originRemove = HTMLElement.prototype.remove;
  HTMLElement.prototype.remove = function () {
    Yuka.reverseMap.delete(this);
    originRemove.apply(this);
  };
})();
