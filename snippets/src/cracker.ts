import { makeScene } from './inc/boilerplate';
import { point, Point, random } from '@13h/core';

makeScene(
  (canvas, t) => {
    //canvas.fade(0.1);
    canvas.clear();
    const points: Point[] = [];
    const n = 20;
    const step = canvas.height / n;
    const rndR = 20;
    const rndL = step;
    const chance = 0.8;
    const w = 1;

    for (let i = 0; i <= canvas.height + step; i += step) {
      points.unshift(point.add([canvas.cx, i], random.pointRot(rndR)));
    }

    for (let i = 1; i < n; i++) {
      const from = points[i - 1];
      const to = points[i];
      canvas.line(from, to, '#0ff', w);
      if (Math.random() < chance) {
        canvas.line(to, random.pointRot(rndL, point.add(to, [0, rndL])), '#0ff', w);
      }
    }
  },
  { frameSkip: 20 }
);
