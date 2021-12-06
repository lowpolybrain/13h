import { Canvas } from '../classes';
import { PointArg } from '../types';
import { point } from './point';
import { RAD_TO_DEG } from '../constants';

export const CGA = {
  black: '#000000',
  blue: '#00A',
  green: '#0A0',
  cyan: '#0A0',
  red: '#A00',
  magenta: '#A0A',
  brown: '#A50',
  lightGray: '#AAA',
  darkGray: '#555',
  lightBlue: '#55f',
  lightGreen: '#5f5',
  lightCyan: '#5F5',
  lightRed: '#F55',
  lightMagenta: '#F5F',
  yellow: '#FF5',
  white: '#FFF'
};

export const color = {
  // TODO: Refactor this horrible clusterfuck
  // Hue between two hues. Last parameter defines whether
  // in degrees (360), radians (TWO_PI) or just from 0 to 1 (1)
  hueBetween(
    fromInDeg: number,
    toInDeg: number,
    multipler: number = 360
  ): number {
    const aaa =
      fromInDeg > multipler
        ? fromInDeg % multipler
        : fromInDeg;
    const bbb =
      toInDeg > multipler ? toInDeg % multipler : toInDeg;
    const aa = aaa / multipler;
    const baa = bbb / multipler;
    const [a, ba] = aa < baa ? [aa, baa] : [baa, aa];
    const b = ba;
    const d = (a + b) / 2;
    return d * multipler;
  },
  hsl(
    hueInDeg: number = 0,
    saturationInPercent: number = 100,
    lightnessInPercent: number = 50,
    alpha: number = 1
  ): string {
    return alpha < 1
      ? `hsla(${hueInDeg}, ${saturationInPercent}%, ${lightnessInPercent}%, ${alpha})`
      : `hsl(${hueInDeg}, ${saturationInPercent}%, ${lightnessInPercent}%)`;
  },

  hslRot(rotInRad: number): string {
    return color.hsl(Math.round(rotInRad * RAD_TO_DEG));
  },

  rgb(
    r255: number = 0,
    g255: number = r255,
    b255: number = r255,
    alpha: number = 1
  ): string {
    return alpha < 1
      ? `rgba(${r255},${g255},${b255}, ${alpha})`
      : `rgba(${r255},${g255},${b255})`;
  },

  ...CGA
};

export const getColor = function (
  canvas: Canvas,
  coords: PointArg
): Uint8ClampedArray {
  const [x, y] = point.get(coords);
  return canvas.context.getImageData(x, y, 1, 1).data;
};
