import { makeFrame } from './inc/boilerplate';
import { DEG_TO_RAD, point, Point, RAD_TO_DEG, TWO_PI, Matrix, random, Canvas, FillStyle } from '@13h/core';

type Direction = { angle: number; speed: number };
type TrailPoint = { pos: Point; angle: number; speed: number };

const rot2Fwd = (speed: number, rot: number) => {
  return point.rotate([0, -speed], rot);
};

const field = Matrix.create<Direction>([20, 20], ([x, y]): Direction => {
  const angle = Math.sin(y / 100) * TWO_PI;
  const speed = random.m32(y * 4 + x) * 80 + 10;
  return { angle, speed };
});

const angle = (c: Canvas, pos: Point, angle: number, length: number = 100, color: FillStyle = '#fff') => {
  const pos2: Point = point.add(pos, rot2Fwd(length, angle));
  c.dot(pos, color, 6);
  c.line(pos, pos2, color, 2);
};

makeFrame((c) => {
  c.fill('#000');
  const ts = [c.width / field.size[0], c.height / field.size[1]];
  field.forEach((vector, [xi, yi], _, [sx, sy]) => {
    const rel = [xi / sx, yi / sy];
    const pos: Point = [c.width * rel[0], c.height * rel[1]];
    angle(c, pos, vector.angle, vector.speed, '#0f03');
    // vector.angle += 0.1;
  });

  for (let ii = 0; ii < 100; ii++) {
    const trailPoint: TrailPoint = { pos: point.mul(random.m32p(ii), c.size), speed: 15, angle: 0 };
    const positions: Point[] = [trailPoint.pos];
    for (let i = 0; i < 100; i++) {
      const flowVector = field.get(point.floor(point.div(c.size, trailPoint.pos)));
      if (flowVector) {
        trailPoint.angle = flowVector.angle;
        const newPos = point.add(trailPoint.pos, rot2Fwd(trailPoint.speed, trailPoint.angle));
        trailPoint.pos = newPos;
        positions.push(newPos);
      }
    }
    c.dot(positions[0], '#f0f', 4);
    c.poly(positions, undefined, 2, '#fff', false);
  }
});
