import { Point } from '@13h/core';
import { MouseCapture } from '@13h/controls';

import { makeCanvas, animate } from '../common';
import { point } from '@13h/core';

const canvas = makeCanvas(128);

const tracker = new MouseCapture(canvas);

animate(() => {
  canvas.fill('#00000016');
  const pos = point.round(point.floor(tracker.pos));
  canvas.dot(pos, '#f00');
});
