import { TWO_PI } from '../constants';

export const angleBetween = (fromInRad: number, toInRad: number): number => {
  const da = (toInRad - fromInRad) % TWO_PI;
  return ((2 * da) % TWO_PI) - da;
};
