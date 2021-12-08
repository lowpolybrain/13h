import { Canvas } from '@13h/core';

export const whiteNoise = (c: Canvas) => {
  const data = c.context.getImageData(0, 0, c.width, c.height);
  const max = c.width * c.height;
  for (let i = 0; i < max; i++) {
    const rnd = Math.round(Math.random() * 255);
    data.data[i * 4] = rnd;
    data.data[i * 4 + 1] = rnd;
    data.data[i * 4 + 2] = rnd;
    data.data[i * 4 + 3] = 255;
  }
  c.context.putImageData(data, 0, 0);
};
