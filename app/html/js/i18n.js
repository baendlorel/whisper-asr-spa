const i18n = (function i18n() {
  const UI_LANGUAGE = 'UI_LANGUAGE';
  const DEFAULT_LANGUAGE = 'zh';

  this.init = () => {
    render(localStorage.getItem(UI_LANGUAGE));
  };

  this.render = (languageAttributeName) => {
    languageAttributeName = languageAttributeName || DEFAULT_LANGUAGE;
    const elements = document.querySelectorAll('[i18n]');
    for (let i = 0; i < elements.length; i++) {
      const element = elements[i];
      for (let j = 0; j < element.childNodes.length; j++) {
        const node = element.childNodes[j];
        if (node.nodeType === Node.TEXT_NODE) {
          node.textContent = element.getAttribute(languageAttributeName);
        }
      }
    }

    localStorage.setItem(UI_LANGUAGE, languageAttributeName);
  };

  return new i18n();
})();
