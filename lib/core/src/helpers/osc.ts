import { Point, PointArg } from '../types';
import { point } from './point';

export const osc = {
  sin: function (t: number, max: number, min: number = 0): number {
    return ((Math.sin(t) + 1) / 2) * (max - min) + min;
  },
  cos: function (t: number, max: number, min: number = 0): number {
    return ((Math.cos(t) + 1) / 2) * (max - min) + min
  },
  sinCos: function (t: PointArg, max: PointArg, min?: PointArg): Point {
    const [tx, ty] = point.get(t);
    const [mx, my] = point.get(max);
    const [ox, oy] = min ? point.get(min) : [0, 0];
    return [osc.sin(tx, mx, ox), osc.cos(ty, my, oy)];
  },
};
