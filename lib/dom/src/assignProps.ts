import { TagName, TagProps, Tag } from './types';
import { assignStyles } from './assignStyles';

// TODO: Fix typescript here

export const assignProps = <TN extends TagName>(element: Tag<TN>, props: TagProps<TN>) => {
  for (const key in props) {
    if (props.hasOwnProperty(key) && props[key] != null) {
      const value = props[key];
      if (value == null) {
        continue;
      }
      if (key === 'style') {
        // @ts-expect-error Something is weird with TagProps
        assignStyles(element, value as CSSStyleDeclaration);
      } else {
        // @ts-expect-error Undefined? Whatever...
        element[key] = value;
      }
    }
  }
};
