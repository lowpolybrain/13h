import { point, Point, random, SQR_TWO, osc, color } from '@13h/core';

import { makeCanvas, animate } from '../common';

const canvas = makeCanvas(2048);
const count = 10000;

animate((n: number) => {
  canvas.fill('#00000016');

  for (let i = 0; i < count; i++) {
    const idx = count / i;
    const poff: Point = point.sub([random.m32(i), random.m32(i + count)], 0.5);
    const sz = random.m32(i + count * 2) + 0.1;
    const poffR = point.rotate(poff, n * 0.001 * sz);
    const pos = point.add(point.mul(poffR, canvas.size, SQR_TWO + osc.sin(((n + i) / 150) * sz, 1)), canvas.center);

    canvas.dot(pos, color.hsl(idx * count + n * 0.1));
  }
});
