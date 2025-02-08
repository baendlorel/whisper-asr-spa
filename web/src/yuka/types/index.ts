export const LanguageTypes = ['zh', 'en'] as const;

export type LanguageType = (typeof LanguageTypes)[number];

export type I18NConfig = { [key in LanguageType]: string };

// export type I18NResponsive = { [key in LanguageType]: string };

export type HTMLElementType = HTMLElementTagNameMap[keyof HTMLElementTagNameMap];
