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
    onError: {
        (handler: (args_0: ErrorEvent) => void): void;
        fire(args_0: ErrorEvent): void;
    };
    constructor(url: string, options?: Partial<ImageOptions>);
    draw(destination: Canvas, [x, y]?: Point, rotation?: number, scale?: PointArg, alpha?: number): this;
    createCanvas(cropStart?: PointArg, cropEnd?: PointArg): Canvas;
}

declare type OnProgress = (image: Image, index: number, totalSuccess: number) => void;
declare const preloadImages: (images: Image[], onFinish: (images: Image[]) => void, onProgress?: OnProgress | undefined) => void;

export { preloadImages };
