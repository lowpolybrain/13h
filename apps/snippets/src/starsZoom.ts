import {
  animate,
  color,
  point,
  random,
  Point,
  TWO_PI
} from '@13h/core';
import { makeCanvas } from '../common';

const canvas = makeCanvas(1024);

const count = 4000;

const getPos = (i: number, n: number): Point => {
  const rot = random.m32(i) * TWO_PI;
  const speed = random.m32(i + count * 2) * 200 + 100;
  const distr =
    ((n / speed + random.m32(i + count)) % 0.9) + 0.1;
  const dist = canvas.width * distr;
  const pos = point.add(
    point.rotate([dist, 0], rot),
    canvas.center
  );
  return pos;
};

const getColor = (i: number, n: number): string => {
  const speed = random.m32(i + count * 2) * 200 + 100;
  const distr =
    ((n / speed + random.m32(i + count)) % 0.9) + 0.1;
  return color.rgb(255, 255, 255, distr);
};

const draw = (n: number) => {
  canvas.fill('#000');

  for (let i = 0; i < count; i++) {
    canvas.dot(getPos(i, n), getColor(i, n), 2);
  }
};

animate(draw, { cleanupId: 'main' });
