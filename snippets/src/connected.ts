import { TWO_PI, point, color, RAD_TO_DEG } from '@13h/core';
import { FlyingBounce } from '@13h/gimmicks';

import { makeCanvas, animate } from '../common';

const res = 3;

const canvas = makeCanvas(128 * Math.pow(2, res));

const bounces = new Array(64).fill(0).map((_, index, all) => {
  const rot = (index / all.length) * TWO_PI;
  const speed = FlyingBounce.speedDirection(4, rot);
  return new FlyingBounce<number>(speed, 1, canvas.width).setPayload(rot).rewind(120);
});

animate(() => {
  canvas.fill('#111');

  bounces.forEach((bounce) => bounce.next());

  const bnc = [...bounces];
  let bounce: FlyingBounce<number> | undefined;

  const dst = canvas.width / 3;

  //eslint-disable-next-line no-cond-assign
  while ((bounce = bnc.pop())) {
    const from = bounce.position;
    const fromColor = bounce.payload || 0;
    for (let i = 0; i < bnc.length; i++) {
      const to = bnc[i].position;
      const toColor = bnc[i].payload || 0;
      const dif = color.hueBetween(fromColor, toColor, TWO_PI);
      const dist: number = point.dist(from, to);
      if (dist <= dst) {
        canvas.line(from, to, color.hsl(dif * RAD_TO_DEG, 100, 50, 1 - dist / dst), res);
      }
    }
  }
});
