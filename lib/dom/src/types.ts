export type TagName = keyof HTMLElementTagNameMap;
export type TagProps<TN extends TagName> = Partial<HTMLElementTagNameMap[TN]>;
export type Tag<TN extends TagName = TagName> = HTMLElementTagNameMap[TN];

export type TagBuilder<TN extends TagName> = Tag<TN> & {
  add: (elements: HTMLElement | HTMLElement[]) => TagBuilder<TN>;
  addTo: (element: HTMLElement) => TagBuilder<TN>;
  css: (styles: CSSStyleDeclaration) => TagBuilder<TN>;
};
