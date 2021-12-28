import { Point, PointArg } from '../types';
import { point } from './point';

export const osc = {
  sin: function (t: number, max: number): number {
    return (Math.sin(t) * max) / 2 + max / 2;
  },
  cos: function (t: number, max: number): number {
    return (Math.cos(t) * max) / 2 + max / 2;
  },
  sinCos: function (t: PointArg, max: PointArg): Point {
    const [tx, ty] = point.get(t);
    const [mx, my] = point.get(max);
    return [osc.sin(tx, mx), osc.cos(ty, my)];
  },
};
