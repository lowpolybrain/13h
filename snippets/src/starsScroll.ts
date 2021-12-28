import { animate, point, random } from '@13h/core';
import { makeCanvas } from './inc/boilerplate';

const canvas = makeCanvas(1024);

const count = 4000;

const draw = (n: number) => {
  canvas.fill('#000');

  for (let i = 0; i < count; i++) {
    const z = random.m32(i + count * 2) * 0.5 + 0.5;
    const s = (n / 500) * z;
    const p = point.add(random.m32p(i, i + count), [s, 0]);
    const pos = point.mul(point.mod(p, 1), canvas.size);
    canvas.dot(point.round(pos), '#fff', Math.round(z * 2));
  }
};

animate(draw, { cleanupId: 'main' });
