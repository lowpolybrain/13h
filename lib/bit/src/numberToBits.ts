import { Point } from '@13h/core';

export const numberToBits = (num: number): number[] => {
  return num
    .toString(2)
    .split('')
    .map((n) => (n == '1' ? 1 : 0));
};
