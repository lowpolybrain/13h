import * as core from '@13h/core';
import * as image from '@13h/image';
import * as filters from '@13h/filters';
import * as gimmicks from '@13h/gimmicks';
import * as preload from '@13h/preload';

const all = {
  ...core,
  ...image,
  ...filters,
  ...gimmicks,
  ...preload,
};

declare global {
  interface Window {
    ['13h']: typeof all;
    int13h: typeof all;
  }
}

window['13h'] = all;
window.int13h = all;
export default all;
