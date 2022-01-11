import { makeScene } from './inc/boilerplate';
import { Canvas, clamp, color, osc, Point, point, PointArg, TWO_PI } from '@13h/core';

makeScene((canvas, n) => {
  canvas.clear();
  const rotPos = osc.sinCos(n / 100, canvas.size, 20);

  const sqSize = 10;
  const sc = 100;
  for (let x = 0; x < canvas.width; x += sqSize) {
    for (let y = 0; y < canvas.height; y += sqSize) {
      const sin = Math.sin((x / sc) * (y / sc) + n / sc);
      const cos = -Math.cos(-0.5 + -(y / sc / 20) * (x / sc) - n / sc);
      const sum = clamp(cos - sin, 0, 1);
      const clr = color.rgb(sum * 255 * 0.5);
      canvas.dot([x, y], clr);
      //canvas.rect([x, y], point.add([x, y], 1), clr);
    }
  }

  canvas.dot(rotPos, '#fff', 4);
});
