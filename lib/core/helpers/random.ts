import { Point } from '../types';

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
  m32p(
    xSeed: number,
    ySeed: number = xSeed + 16000
  ): Point {
    return [random.m32(xSeed), random.m32(ySeed)];
  }
};
