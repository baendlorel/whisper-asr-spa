const i18n = (function () {
  const UI_LANGUAGE = 'UI_LANGUAGE';
  const DEFAULT_LANGUAGE = 'zh';

  const init = () => {
    render(localStorage.getItem(UI_LANGUAGE));
  };

  const getCurrentUILanguage = () => {
    return localStorage.getItem(UI_LANGUAGE) || DEFAULT_LANGUAGE;
  };

  const render = (languageAttributeName) => {
    languageAttributeName = languageAttributeName || DEFAULT_LANGUAGE;

    const elements = document.querySelectorAll('[i18n]');
    for (let i = 0; i < elements.length; i++) {
      const el = elements[i];
      const childs = el.childNodes;

      if (childs.length === 0) {
        el.textContent = el.getAttribute(languageAttributeName);
      } else {
        for (let j = 0; j < childs.length; j++) {
          const node = childs[j];
          if (node.nodeType === Node.TEXT_NODE) {
            node.textContent = el.getAttribute(languageAttributeName);
          }
        }
      }
    }

    localStorage.setItem(UI_LANGUAGE, languageAttributeName);
  };

  return { init, render, getCurrentUILanguage };
})();
