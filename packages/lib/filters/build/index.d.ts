import { Canvas } from "@13h/core";
type ColorArg = Uint8ClampedArray | [
    number,
    number,
    number
];
// TODO: Write in doc about alpha-premultiplication
declare const setColorTransparency: (canvas: Canvas, color: ColorArg, transparency1?: number) => null | undefined;
declare const makeColorTransparent: (canvas: Canvas, color: Uint8ClampedArray | [
    number,
    number,
    number
]) => void;
export { setColorTransparency, makeColorTransparent };
