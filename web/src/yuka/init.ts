import { Yuka } from './yuka.class';

(() => {
  const deleteChilren = (el: HTMLElement) => {
    Yuka.reverseMap.delete(el);
    for (let i = 0; i < el.children.length; i++) {
      deleteChilren(el.children[i] as HTMLElement);
    }
  };

  // 创建 MutationObserver 实例
  const observer = new MutationObserver((mutationsList: MutationRecord[]) => {
    mutationsList.forEach((mutation) => {
      if (mutation.type !== 'childList') {
        return;
      }

      // 检查被删除的节点
      for (let i = 0; i < mutation.removedNodes.length; i++) {
        const el = mutation.removedNodes[i] as HTMLElement;
        if (el.nodeType !== Node.ELEMENT_NODE) {
          continue;
        }
        deleteChilren(el);
      }
    });
  });

  // 配置观察选项
  const config = {
    childList: true, // 监听子节点的变化
    subtree: true, // 监听所有后代节点
  };

  // 开始观察
  observer.observe(document.body, config);
})();
