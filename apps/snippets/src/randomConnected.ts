import { point, random, color } from '@13h/core';
import { makeCanvas, animate } from '../common';

const canvas = makeCanvas(1024);
canvas.element.style.filter =
  'blur(40px) brightness(2) contrast(140%) saturate(150%)';

const points: [number, number][] = new Array(50)
  .fill(0)
  .map((_, index, all) => [
    random.m32(index),
    random.m32(index + all.length)
  ]);

animate((n: number) => {
  canvas.fill('#111');
  for (let i = 0; i < points.length; i++) {
    const sx = random.m32(i) - 0.5;
    const sy = random.m32(i + points.length) - 0.5;
    const mul = 0.005;
    points[i][0] = (points[i][0] += sx * mul) % 1;
    points[i][1] = (points[i][1] += sy * mul) % 1;
  }

  const mdist = 0.5;
  for (let i = 0; i < points.length; i++) {
    const a = points[i];
    for (let n = i; n < points.length; n++) {
      const b = points[n];
      const dist = point.dist(a, b);
      if (dist < mdist) {
        canvas.line(
          point.mul(a, canvas.size),
          point.mul(b, canvas.size),
          color.rgb(128, 128, 255, 1 - dist / mdist),
          4
        );
      }
    }
  }
});
