import { Point, PointArg, Canvas } from '@13h/core';

declare class FlyingBounce<Payload = never> {
    position: [number, number];
    speed: [number, number];
    size: Point;
    borderSize: Point;
    payload: Payload;
    step: number;
    constructor(speed?: PointArg, size?: PointArg, borderSize?: PointArg, startPos?: PointArg);
    setPayload(pl: Payload): this;
    private hitTest;
    next(): void;
    rewind(steps: number): this;
    static randomDirection(speed: number): Point;
    static speedDirection(speed: number, rotInRad: number): Point;
}

declare const whiteNoise: (c: Canvas) => void;

export { FlyingBounce, whiteNoise };
