export type DomReadyArg = (e?: Event) => void;
export type DomReadyReturn = () => void;

const eventName: string = 'DOMContentLoaded';
const isIframe: boolean = 'doScroll' in document.documentElement;
let isLoaded: boolean = !!document.readyState.match(isIframe ? /^loaded|^c/ : /^loaded|^i|^c/);

const noop = function () {};

const onLoad = function () {
  isLoaded = true;
  document.removeEventListener(eventName, onLoad);
};

if (!isLoaded) {
  document.addEventListener(eventName, onLoad);
}

/**
 * Helper that will fire provided function if DOM is already loaded or after it will be loaded.
 * @param addedListener
 */
export const domReady = (addedListener: DomReadyArg): DomReadyReturn => {
  if (!isLoaded) {
    const handler = function (e: Event) {
      document.removeEventListener('eventName', addedListener);
      addedListener(e);
    };

    document.addEventListener(eventName, handler);
    return function () {
      document.removeEventListener(eventName, handler);
    };
  } else {
    window.setTimeout(() => addedListener(undefined), 0);
    return noop;
  }
};
