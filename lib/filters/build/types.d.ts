import { Canvas } from '@13h/core';

declare type ColorArg = Uint8ClampedArray | [number, number, number];
declare const setColorTransparency: (canvas: Canvas, color: ColorArg, transparency1?: number) => any;
declare const makeColorTransparent: (canvas: Canvas, color: Uint8ClampedArray | [number, number, number]) => void;

export { makeColorTransparent, setColorTransparency };
