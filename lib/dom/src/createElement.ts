import { TagProps, TagName, TagBuilder, Tag } from './types';
import { assignProps } from './assignProps';
import { assignStyles } from './assignStyles';

export const createElement = <TN extends TagName, TP extends TagProps<TN> = TagProps<TN>>(
  tagName: TN,
  props?: TP | 0
): TagBuilder<TN> => {
  const element = document.createElement(tagName) as TagBuilder<TN>;
  if (props) {
    assignProps(element, props);
  }
  element.add = (child: HTMLElement | HTMLElement[]) => {
    if (Array.isArray(child)) {
      child.forEach((el) => element.appendChild(el));
    } else {
      element.appendChild(child);
    }
    return element;
  };
  element.addTo = (target: HTMLElement) => {
    target.appendChild(element);
    return element;
  };
  element.css = (css: CSSStyleDeclaration) => {
    assignStyles(element, css);
    return element;
  };
  return element;
};
