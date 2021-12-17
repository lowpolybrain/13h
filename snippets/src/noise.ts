import { Canvas } from '@13h/core';
import { whiteNoise } from '@13h/gimmicks';

console.log('Hello');

import { makeCanvas, animate } from '../common';

const canvas = makeCanvas(512);

const noise = new Canvas(100);

animate(() => {
  whiteNoise(noise);
  const pattern = canvas.createPattern(noise);
  if (pattern) {
    canvas.fill(pattern);
  }
});
