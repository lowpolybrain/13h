import { Point } from '@13h/core';
import { MouseTracker } from '@13h/controls';

import { makeCanvas, animate } from './inc/boilerplate';
import { point } from '@13h/core';

const canvas = makeCanvas(128);
canvas.element.style.cursor = 'none';

const tracker = new MouseTracker();
tracker.mount(canvas);

let prevPos: Point | undefined;

animate((n: number) => {
  canvas.fill('#00000016');
  const pos = point.floor(tracker.pos);
  canvas.context.font = 'normal 8px monospace';
  canvas.text.center(`${pos[0]}x${pos[1]}`, canvas.center, '#fff');
  canvas.dot(tracker.pos, '#f00');
  if (prevPos) {
    canvas.line(point.addHalf(tracker.pos), prevPos, '#f00');
  }
  prevPos = point.addHalf(tracker.pos);
});
