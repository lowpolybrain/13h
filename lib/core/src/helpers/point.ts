import { Point, PointArg } from '../types';

const getPoint = function (point: PointArg, default_: Point = [0, 0]): Point {
  if (point == null) {
    return [default_[0], default_[1]];
  }
  return typeof point === 'number' ? [point, point] : [point[0], point[1]];
};

export const clamp = (n: number, min: number, max: number) => Math.min(Math.max(n, min), max);
export const diag = (sides: PointArg) => {
  const [a, b] = getPoint(sides);
  return Math.sqrt(a * a + b * b);
};

// TODO: Maybe, split fns to "fast" and "handy".
// Or maybe not (fast should be calculated separately then, without creating arrays)
export const point = {
  half: [0.5, 0.5] as Point,
  zero: [0, 0] as Point,
  one: [1, 1] as Point,

  /** Add a half of another point to point. By default will add [0.5, 0.5] which is helpful to draw 1-px wide lines */
  addHalf(point: Point, b: PointArg = 1): Point {
    const [x, y] = getPoint(b);
    return [point[0] + x / 2, point[1] + y / 2];
  },
  subHalf(pnt: Point, b: PointArg = 1): Point {
    const [x, y] = getPoint(b);
    return point.addHalf(pnt, [-x, -y]);
  },
  /** Check if point belongs to rectangular region */
  insideRect(point: Point, topLeft: PointArg, bottomRight: PointArg): boolean {
    const [sx, sy] = getPoint(topLeft);
    const [ex, ey] = getPoint(bottomRight);
    return point[0] >= sx && point[0] <= ex && point[1] >= sy && point[1] <= ey;
  },
  /** apply Math.round to both operands */
  round(point: Point): Point {
    return [Math.round(point[0]), Math.round(point[1])];
  },
  /** apply Math.floor to both operands */
  floor(point: Point): Point {
    return [Math.floor(point[0]), Math.floor(point[1])];
  },
  /** apply Math.ceil to both operands */
  ceil(point: Point): Point {
    return [Math.ceil(point[0]), Math.ceil(point[1])];
  },
  /** Add all the points. Useful to offset point.*/
  add(...args: PointArg[]): Point {
    let sx = 0;
    let sy = 0;
    for (let i = 0; i < args.length; i++) {
      const [ax, ay] = point.get(args[i]);
      sx += ax;
      sy += ay;
    }
    return [sx, sy];
  },

  /** Returns distance between two points */
  dist(a: Point, b: Point = [0, 0]): number {
    const dx = a[0] - b[0];
    const dy = a[1] - b[1];
    return Math.sqrt(dx * dx + dy * dy);
  },

  /** Returns point with both arguments negated */
  neg([ax, ay]: Point): Point {
    return [-ax, -ay];
  },

  /** Multiply one or more points. */
  mul(...args: PointArg[]): Point {
    let mx = 1;
    let my = 1;
    for (let i = 0; i < args.length; i++) {
      const [x, y] = getPoint(args[i]);
      mx *= x;
      my *= y;
    }
    return [mx, my];
  },

  /** Divide one point to another.*/
  div([ax, ay]: Point, b: PointArg): Point {
    const [bx, by] = getPoint(b);
    return [ax / bx, ay / by];
  },

  /** Subtract one point from another. */
  sub([ax, ay]: Point, b: PointArg): Point {
    const [bx, by] = getPoint(b);
    return [ax - bx, ay - by];
  },

  /** Get point from PointArg */
  get: getPoint,

  /** Multiply point by scale, relative to pivot. Useful to work with shapes*/
  scale([x, y]: Point, scale: PointArg, pivot?: PointArg): Point {
    const [sx, sy] = getPoint(scale);
    const [px, py] = getPoint(pivot);
    return [(x - px) * sx + py, (y - py) * sy + py];
  },

  /** Get remainder of division of both point operands by second argument */
  mod([x, y]: Point, b: PointArg): Point {
    const [bx, by] = getPoint(b);
    return [x % bx, y % by];
  },

  /** Rotate the point around pivot by angle. Useful to work with shapes. */
  rotate([x, y]: Point, angle: number, pivot?: PointArg): Point {
    const [px, py] = getPoint(pivot || [0, 0]);
    const sin = Math.sin(angle);
    const cos = Math.cos(angle);
    return [sin * (x - px) + cos * (y - py) + px, sin * (y - py) - cos * (x - px) + py];
  },

  /** Calculate an angle between line facing upwards from a and line from a to b.  */
  rotBetween(a: Point, b: Point): number {
    return Math.atan2(b[1] - a[1], b[0] - a[0]);
  },

  between(a: Point, b: Point): Point {
    return [(a[0] + b[0]) / 2, (a[1] + b[1]) / 2];
  },

  sizeToScale(currentSize: PointArg, targetSize: PointArg): Point {
    const cs = point.get(currentSize);
    if (cs[0] === 0 || cs[1] === 0) return [0, 0];
    const ts = point.get(targetSize);
    return [ts[0] / cs[0], ts[1] / cs[1]];
  },

  clamp([x, y]: Point, [mnx, mny]: Point, [mxx, mxy]: Point): Point {
    return [clamp(x, mnx, mxx), clamp(y, mny, mxy)];
  },

  eq(...points: PointArg[]): boolean {
    if (points.length === 1) return true;
    const firstPoint = getPoint(points[0]);
    for (let i = 1; i < points.length; i++) {
      const p = getPoint(points[i]);
      if (p[0] !== firstPoint[0] || p[1] !== firstPoint[1]) {
        return false;
      }
    }
    return true;
  },
};
