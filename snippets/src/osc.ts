import { makeScene } from './inc/boilerplate';
import { osc, point } from '@13h/core';

makeScene((canvas, n) => {
  canvas.clear();
  const rotPos = osc.sinCos(n / 100, canvas.size, 20);
  canvas.dot(rotPos, '#fff', 4);
  canvas.text.center(point.round(rotPos).toString(), point.add(rotPos, [0, -10]));
});
