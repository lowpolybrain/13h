import { Point, PointArg } from '../types';
import { point } from './point';

export const random = {
  range(min: number, max: number): number {
    return Math.random() * (max - min) + min;
  },
  iRange(min: number, max: number): number {
    return Math.round(random.range(min, max));
  },
  m32(seed: number): number {
    let t = seed + 0x6d2b79f5;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  },
  point(min: PointArg = 0, max: PointArg = 1): Point {
    const [mnx, mny] = point.get(min);
    const [mxx, mxy] = point.get(max);
    return [random.range(mnx, mxx), random.range(mny, mxy)];
  },
  pointRot(r: number, center: PointArg = 0): Point {
    const [cx, cy] = point.get(center);
    const R = r * Math.sqrt(Math.random());
    const T = Math.random() * 2 * Math.PI;
    return [cx + R * Math.cos(T), cy + R * Math.sin(T)];
  },
  m32p(xSeed: number, ySeed: number = xSeed + 16000): Point {
    return [random.m32(xSeed), random.m32(ySeed)];
  },
};
