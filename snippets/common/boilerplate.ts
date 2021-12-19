import { Canvas, animate as anim, PointArg } from '@13h/core';

export const makeCanvas = (w: PointArg, addClassName: boolean = true) => {
  const canvas = new Canvas(w, document.body).crisp();
  if (addClassName) {
    canvas.element.className = 'mainCanvas';
  }
  return canvas;
};

export const animate = (fn: (n: number, t: number) => void) => {
  anim(fn, { cleanupId: 'main' });
};
