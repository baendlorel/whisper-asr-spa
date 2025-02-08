let cssString: string[] = [];

export const _css = (cssText: string, scopeName?: string) => {
  const c =
    scopeName === undefined
      ? cssText
      : cssText
          .replace(/[\s]+\,/g, ',')
          .replace(/[\s]+\{/g, '{')
          .replace(/\,/g, `[${scopeName}],`)
          .replace(/\{/g, `[${scopeName}]{`);
  cssString.push(c);
};

export const applyCss = () => {
  const style = document.createElement('style');
  style.innerHTML = cssString.join(' ');
  style.setAttribute('yuka', '');
  document.body.append(style);
};
