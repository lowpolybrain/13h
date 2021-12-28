import { TagName, Tag } from './types';

export const assignStyles = <TN extends TagName>(element: Tag<TN>, styles: CSSStyleDeclaration): HTMLElement => {
  for (const name in styles) {
    if (styles.hasOwnProperty(name)) {
      element.style[name] = styles[name];
    }
  }
  return element;
};
