import { Canvas } from '@13h/core';

type ColorArg = Uint8ClampedArray | [number, number, number];

// TODO: Write in doc about alpha-premultiplication
export const setColorTransparency = function (canvas: Canvas, color: ColorArg, transparency1: number = 1) {
  if (!color) {
    return null;
  }
  const transparency = Math.floor(transparency1 * 255);

  const [tr, tg, tb] = color;
  const [width, height] = canvas.size;
  const imageData: ImageData = canvas.context.getImageData(0, 0, width, height);

  for (let i = 0; i < imageData.data.length; i += 4) {
    const r = imageData.data[i];
    const g = imageData.data[i + 1];
    const b = imageData.data[i + 2];
    if (tr === r && tg === g && tb === b) {
      imageData.data[i + 3] = transparency;
    }
  }
  canvas.context.putImageData(imageData, 0, 0);
};

export const makeColorTransparent = function (canvas: Canvas, color: Uint8ClampedArray | [number, number, number]) {
  setColorTransparency(canvas, color, 0);
};
