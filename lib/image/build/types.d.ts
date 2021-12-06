import { Point, Canvas, PointArg } from '@13h/core';

declare type ImageOptions = {
    crossOrigin: boolean;
};
declare class Image {
    private url;
    private _isReady;
    element: HTMLImageElement;
    private _size;
    private _center;
    private _pivot;
    get pivot(): Point;
    get size(): Point;
    get height(): number;
    get width(): number;
    get cx(): number;
    get cy(): number;
    get center(): Point;
    setSize([width, height]: Point): this;
    get isReady(): boolean;
    onLoad: {
        (handler: (args_0: Image) => void): void;
        fire(args_0: Image): void;
    };
    constructor(url: string, options?: Partial<ImageOptions>);
    draw(destination: Canvas, [x, y]?: Point, rotation?: number, scale?: PointArg, alpha?: number): this;
    createCanvas(cropStart?: PointArg, cropEnd?: PointArg): Canvas;
}

declare class FixedSprite {
    private image;
    private spriteNum?;
    private size;
    private _sprite;
    private spriteIndex;
    constructor(image: Image | Canvas, size: PointArg, spriteNum?: Point);
    setSpriteIndex(index: number): this;
    get lastFrameIndex(): number;
    nextSprite(): this;
    draw(destination: Canvas, pos?: Point, rotation?: number, scale?: PointArg, alpha?: number): this;
    private getSpriteNum;
    getDebugCanvas(): Canvas;
}

export { FixedSprite, Image, ImageOptions };
