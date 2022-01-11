import { Canvas, point, Point, PointArg } from '@13h/core';

export type GraphF = (x: number) => number;

export const graph = (c: Canvas, points: Point[], pos: Point, size: PointArg) => {
  const sze = point.get(size);
  const start = point.subHalf(pos, sze);
  const end = point.addHalf(pos, sze);
  c.rect(start, end, '#fff2');
  c.line([start[0], pos[1]], [end[0], pos[1]], '#fff2', 2);
  c.line([pos[0], start[1]], [pos[0], end[1]], '#fff2', 2);
  const pointToLocal = (p: Point): Point => {
    return point.add(point.mul(p, size, 0.5), pos);
  };
  c.poly(points.map(pointToLocal), undefined, 1, '#fff', false);
};

export const plotGraph = (c: Canvas, f: GraphF, pos: Point, size: PointArg = 256, numPoints = 256) => {
  const points: Point[] = [];
  const step = 2 / numPoints;
  for (let x = -1; x <= 1; x += step) {
    points.push([x, f(x)]);
  }
  graph(c, points, pos, size);
};

export const mul =
  (...fs: GraphF[]): GraphF =>
  (x) => {
    let result = 1;
    fs.forEach((f) => (result *= f(x)));
    return result;
  };

export const add =
  (...fs: GraphF[]): GraphF =>
  (x) => {
    let result = 1;
    fs.forEach((f) => (result += f(x)));
    return result;
  };

export const curry =
  (...fs: GraphF[]): GraphF =>
  (x) => {
    fs.forEach((f) => {
      x = f(x);
    });
    return x;
  };
