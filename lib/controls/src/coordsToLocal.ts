import { Canvas, Point } from '@13h/core';

/** turn screen coordinates to canvas local coordinates */
export const coordsToLocal = (c: Canvas, offsetCoords: Point): Point => {
  const realWidth = c.element.offsetWidth;
  const realHeight = c.element.offsetHeight;

  return [c.size[0] * (offsetCoords[0] / realWidth), c.size[1] * (offsetCoords[1] / realHeight)];
};
