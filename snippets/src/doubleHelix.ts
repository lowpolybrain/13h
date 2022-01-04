import { makeScene } from './inc/boilerplate';
import { Canvas, color, osc, PI_BY_TWO, point } from '@13h/core';

const canvas = new Canvas(512);
canvas.fill('#000');

makeScene((screenCanvas, n) => {
  const offs = 8;

  canvas.draw(canvas, point.add(canvas.pivot, [0, offs]));
  canvas.rect(point.zero, [canvas.width, offs], '#000');

  const pad = 25;
  const on = n / (offs * 5);
  const x1 = osc.sin(on, canvas.width, pad);
  const x2 = osc.sin(on + Math.PI, canvas.width, pad);

  if (!(n % offs)) {
    canvas.line([x1, 0], [x2, 0], color.hsl(osc.sin(n, 360)), offs * 2);
  }

  canvas.dot([x1, 0], '#f00', offs * 2);
  canvas.dot([x2, 0], '#f00', offs * 2);
  canvas.dot([x1, 0], '#ff0', offs);
  canvas.dot([x2, 0], '#ff0', offs);
  canvas.fade(0.2);

  ///
  canvas.centerPivot().draw(screenCanvas.clear(), screenCanvas.center);
});
