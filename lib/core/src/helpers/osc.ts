import { Point, PointArg } from '../types';
import { point } from './point';

export const osc = {
  sin: function (t: number, max: number, padding: number = 0): number {
    return (Math.sin(t) * (max - padding * 2)) / 2 + max / 2;
  },
  cos: function (t: number, max: number, padding: number = 0): number {
    return (Math.cos(t) * (max - padding * 2)) / 2 + max / 2;
  },
  sinCos: function (t: PointArg, max: PointArg, padding?: PointArg): Point {
    const [tx, ty] = point.get(t);
    const [mx, my] = point.get(max);
    const [ox, oy] = padding ? point.get(padding) : [0, 0];
    return [osc.sin(tx, mx, ox), osc.cos(ty, my, oy)];
  },
};
