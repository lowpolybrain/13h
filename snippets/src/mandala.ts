import {
  Canvas,
  point,
  osc,
  shape,
  DEG_TO_RAD,
  RAD_TO_DEG,
  TWO_PI,
  color
} from '@13h/core';

import { animate, makeCanvas} from '../common';

const canvas = makeCanvas(512);

const letter = new Canvas(50);
letter.centerPivot();

animate((n: number) => {
  const dp = point.floor([
    osc.sin(n / 25, canvas.width - 50) + 25,
    osc.cos(n / 25, canvas.width - 50) + 25
  ]);

  const rot = (n / 200) % TWO_PI;

  const s = 12;

  const ngon = shape.build
    .ngon(s)
    .scale(canvas.width / 4)
    .rotate(rot * 9);

  canvas
    .fill('#111')
    .crisp()
    .poly(canvas.getContour(true), undefined, 1, '#0f0');

  ngon.shape.forEach((pnt, i) => {
    const t = (i / s) * TWO_PI;
    canvas.poly(
      shape.build
        .ngon(5)
        .scale([20, 80])
        .translate([0, osc.sin(n / 50 + -t * 2, 40) - 15])
        .rotate((270 - (360 / s) * i) * DEG_TO_RAD)
        .rotate(rot * 10)
        .translate(canvas.center)
        .translate(pnt).shape,
      undefined,
      4,
      color.hsl(i * (360 / s) - n)
    );
  });

  letter
    .clear()
    .text.center(
      Math.floor(rot * RAD_TO_DEG),
      letter.center,
      '#fff'
    )
    .draw(canvas, dp, rot, osc.sin(n / 40, 5) + 1);
});
