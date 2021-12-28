import { makeCanvas, animate } from './inc/boilerplate';
import { MouseTracker } from '@13h/controls';
import { fitParent } from '@13h/dom';
import { Canvas, color, diag, FillStyle, point, Point, RAD_TO_DEG } from '@13h/core';

const canvas = makeCanvas(512);
const mouse = new MouseTracker(canvas);

const drawLine = (
  canvas: Canvas,
  pos: Point,
  rot: number,
  color: FillStyle = '#fff',
  width: number = 2,
  length: number = 20
) => {
  canvas.line(pos, point.add(pos, point.rotate([0, -length], rot)), color, width);
};

animate((n) => {
  fitParent(canvas, 0.5);
  canvas.fill('#444');
  const { pos } = mouse;
  const s = 20;
  const l = diag(20);
  for (let x = 0; x <= canvas.width; x += s/2) {
    for (let y = 0; y <= canvas.height; y += s/4) {
      const p: Point = [x, y];
      const rot = point.rotBetween(pos, p);
      drawLine(canvas, p, rot, color.hsl(rot * ((x * y) / 10000) * RAD_TO_DEG), 100, l);
    }
  }
});
