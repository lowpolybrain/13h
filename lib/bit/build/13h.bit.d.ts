import { Point, Canvas, PointArg } from '@13h/core';

declare class BitMap {
    private bits;
    size: Point;
    constructor(bits: number[], size: Point);
    drawPixels(c: Canvas, pos?: PointArg, color?: [number, number, number, number]): void;
    static fromNumber(num: number, size: Point): BitMap;
}

declare const numberToBits: (num: number) => number[];

export { BitMap, numberToBits };
