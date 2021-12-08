import { Canvas, animate as anim } from '@13h/core';

export const makeCanvas = (w: number) => {
  const canvas = new Canvas(w, document.body).crisp();
  canvas.element.className = 'mainCanvas';
  return canvas;
};

export const animate = (
  fn: (n: number, t: number) => void
) => {
  anim(fn, { cleanupId: 'main' });
};
