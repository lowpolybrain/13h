import { Canvas, FillStyle, osc, Point, point, RAD_TO_DEG, random, color } from '@13h/core';
import { animate, makeCanvas } from './inc/boilerplate';
import { Trail } from './inc/Trail';

const canvas = makeCanvas(1024);

const spray = (target: Canvas, pos: Point, color?: FillStyle, radius: number = 5, n: number = 5, pSize: number = 1) => {
  for (let i = 0; i < n; i++) {
    target.dot(point.round(random.pointRot(radius, pos)), color, pSize);
  }
};

const pad = 10;
const maxWidth = canvas.width / 2;

const trail1 = new Trail();
const trail2 = new Trail();

animate(
  (n) => {
    const rot = -n / 5;
    const r = osc.sin(n / 40, maxWidth - pad) + pad;
    trail1.nextPoint(point.rotate(point.add(point.rotate([r, 0], rot), canvas.center), n / 10, canvas.center));
    trail2.nextPoint(point.add(point.rotate([r, 0], -rot), canvas.center));
    const clr = color.hsl(rot * RAD_TO_DEG);
    if (trail1.drawable) {
      canvas.line(trail1.a, trail1.b, clr, 4);
    }
    if (trail2.drawable) {
      canvas.line(trail2.a, trail2.b, clr, 3);
    }
    spray(canvas, canvas.center, '#fff', maxWidth - pad, 5, random.iRange(1, 5));
    if (n % 5 === 0) {
      canvas.fade(0.2);
    }
  },
  { initialSkip: 100 }
);
