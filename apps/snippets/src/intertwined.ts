import { TWO_PI, color, RAD_TO_DEG } from '@13h/core';
import { FlyingBounce } from '@13h/gimmicks/src';

import { makeCanvas, animate } from '../common/boilerplate';

const canvas = makeCanvas(256);

const bounces = new Array(128)
  .fill(0)
  .map((_, index, all) => {
    const rot = (index / all.length) * TWO_PI + 0.1;
    const speed = FlyingBounce.speedDirection(2, rot);
    return new FlyingBounce<number>(
      speed,
      1,
      canvas.width
    ).setPayload(rot);
  });

animate((n: number) => {
  canvas.fill('#11111105');

  bounces.forEach((bounce) => bounce.next());

  bounces.forEach((bounce) => {
    const clr = color.hsl(bounce.payload * RAD_TO_DEG);
    canvas.dot(bounce.position, clr, 4);
  });
});
