import { point } from '@13h/core';
import { makeCanvas, animate } from './inc/boilerplate';

const canvas = makeCanvas(256);

animate((n: number, t: number) => {
  canvas
    .fill('#111')
    .text.center(n, canvas.center, '#f00')
    .text.center(Math.floor(t), point.add(canvas.center, [0, 10]), '#f00');
});
