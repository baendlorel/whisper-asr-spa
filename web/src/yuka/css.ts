let cssString: string[] = [];

export const css = (cssText: string, scopeName?: string) => {
  const c =
    scopeName === undefined
      ? cssText
      : cssText
          .replace(/[\s]+\,/g, ',')
          .replace(/[\s]+\{/g, '{')
          .replace(/\,/g, `[${scopeName}],`)
          .replace(/\{/g, `[${scopeName}]{`);
  cssString.push(c);
  return css;
};

export const genScopeName = () => {
  return 'yuka-bbbbbbb'.replace(/bbbbbbb/g, () =>
    String.fromCharCode(97 + Math.floor(Math.random() * 26))
  );
};

export const applyCss = () => {
  const style = document.createElement('style');
  style.innerHTML = cssString.join(' ');
  style.setAttribute('yuka', '');
  document.body.append(style);
};
