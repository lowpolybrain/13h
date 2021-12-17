import { Canvas, point, PointArg } from '@13h/core';

export const grid = (c: Canvas, size: PointArg = 16, color = '#f00', width: number = 1) => {
  const [w, h] = point.get(size);
  const add = width % 2 ? 0.5 : 0;
  for (let x = 0; x < c.width; x += w) {
    c.line([x + add, 0], [x + add, c.height], color, width);
  }
  for (let y = 0; y < c.height; y += h) {
    c.line([0, y + add], [c.width, y + add], color, width);
  }
};
