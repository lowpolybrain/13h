import { Canvas } from '@13h/core';
import { whiteNoise } from '@13h/gimmicks';

import { makeCanvas, animate } from '../common';

const canvas = makeCanvas(512);

const noise = new Canvas(100);

animate(() => {
  whiteNoise(noise);
  const pattern = canvas.createPattern(noise);

  canvas.fill(pattern);
});
