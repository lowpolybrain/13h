import { Canvas, animate as anim, PointArg, AnimateOptions } from '@13h/core';
import { fitParent } from '@13h/dom';

export const makeCanvas = (w: PointArg = 256, addClassName: boolean = true) => {
  const canvas = new Canvas(w, document.body).crisp();
  if (addClassName) {
    canvas.element.className = 'mainCanvas';
  }
  return canvas;
};

export const animate = (fn: (n: number, t: number) => void, opts?: AnimateOptions) => {
  anim(fn, { ...opts, cleanupId: 'main' });
};

export const makeScene = (fn: (c: Canvas, t: number) => void, opts?: AnimateOptions) => {
  const canvas = makeCanvas(1);
  animate((n) => {
    fitParent(canvas);
    fn(canvas, n);
  }, opts);
};
