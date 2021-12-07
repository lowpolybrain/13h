type Point = Readonly<[
    number,
    number
]>;
type Points = Readonly<Point[]>;
type PointArg = Point | number | undefined;
type Shape = Readonly<Point[]>;
type FillStyle = CanvasRenderingContext2D["fillStyle"];
type StrokeStyle = CanvasRenderingContext2D["strokeStyle"];
type FontStyle = CanvasRenderingContext2D["font"];
declare enum Corner {
    TopLeft = "topLeft",
    TopRight = "topRight",
    BottomRight = "bottomRight",
    BottomLeft = "bottomLeft"
}
declare enum BoxPoint {
    Center = "center",
    TopLeft = "topLeft",
    TopRight = "topRight",
    BottomRight = "bottomRight",
    BottomLeft = "bottomLeft"
}
type Corners = Record<Corner, Point>;
type Box = Record<BoxPoint, Point>;
declare enum LineCap {
    Butt = "butt",
    Round = "round",
    Square = "square"
}
declare enum Repeat {
    XY = "repeat",
    X = "repeat-x",
    Y = "repeat-y",
    None = "no-repeat"
}
interface Text<P> {
    (text: string | number, pos?: Point, fill?: FillStyle): P;
    center: this;
}
declare class Canvas {
    private strokeFill;
    element: HTMLCanvasElement;
    context: CanvasRenderingContext2D;
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
    getCorners(offsetHalf?: boolean): Corners;
    getContour(offsetHalf?: boolean): Shape;
    constructor(size?: PointArg, target?: HTMLElement);
    appendTo(target: HTMLElement): this;
    setSize([width, height]: Point): this;
    setPivot([width, height]: Point): this;
    centerPivot(): this;
    rect([x1, y1]: Point, [x2, y2]: Point, fill?: FillStyle): this;
    dot([x, y]: Point, color?: FillStyle, size?: number): this;
    setFillStyle(fillStyle?: FillStyle): this;
    fill(fillStyle: FillStyle): this;
    clear(): this;
    // TODO: Refactor maybe
    crisp(): this;
    // TODO: Rid of C0DEFF past :D
    draw(destination: Canvas, [x, y]?: Point, rotation?: number, scale?: PointArg, alpha?: number): this;
    line(a: PointArg, b: PointArg, color: FillStyle, width?: number): this;
    createPattern(c: CanvasImageSource | Canvas, repetition?: Repeat): CanvasPattern | null;
    poly(shape: Shape, fillStyle?: FillStyle, lineWidth?: number, strokeColor?: FillStyle, closePath?: boolean, lineCap?: LineCap): this;
    copy(cropStart?: PointArg, cropEnd?: PointArg): Canvas;
    // TODO: Split this
    get text(): Text<this>;
}
type EventHandler<Args extends Array<unknown>> = (...args: Args) => void;
declare class EventListener<Args extends Array<unknown>> {
    // If event has been fired, on adding handler - it will be called
    // (will also be added to handlers)
    private fireOnAdd;
    // The event fires only once
    private happensOnce;
    private timesFired;
    constructor(fireOnAdd?: boolean, happensOnce?: boolean);
    handlers: EventHandler<Args>[];
    addHandler(eh: EventHandler<Args>): void;
    lastArgs?: Args;
    fire(...args: Args): void;
}
declare const makeListener: <Args extends unknown[]>(fireOnAdd?: boolean, happensOnce?: boolean) => {
    (handler: EventHandler<Args>): void;
    fire(...args: Args): void;
};
declare const TWO_PI: number;
declare const DEG_TO_RAD: number;
declare const RAD_TO_DEG: number;
declare const PI_BY_TWO: number;
declare const SQR_TWO: number;
declare const REVISION = 2;
type AnimateMethod = (
// Render counter - it is incremented for every render.
// Affected by frameSkip and frameRepeat.
renderedFrame: number, 
// Time provided by requestAnimationFrame (if any)
time: number) => void;
type AnimateOptions = {
    initialSkip?: number;
    // Repeat each frame
    frameRepeat?: number;
    // How many frames to skip. If you provide 5 here - only every
    // 5th call will be landed. Useful to slow stuff down
    frameSkip?: number;
    // Used for sandboxes and hot module reloading to kill
    // previous requestAnimationFrames (as they stack up)
    // leading to tremendous performance problems
    cleanupId?: string;
};
declare global {
    interface Window {
        _cdeCleanup?: Record<string, number>;
    }
}
declare const animate: (nextFrame: AnimateMethod, options?: AnimateOptions) => void;
declare const osc: {
    sin: (t: number, max: number) => number;
    cos: (t: number, max: number) => number;
};
declare const CGA: {
    black: string;
    blue: string;
    green: string;
    cyan: string;
    red: string;
    magenta: string;
    brown: string;
    lightGray: string;
    darkGray: string;
    lightBlue: string;
    lightGreen: string;
    lightCyan: string;
    lightRed: string;
    lightMagenta: string;
    yellow: string;
    white: string;
};
declare const color: {
    black: string;
    blue: string;
    green: string;
    cyan: string;
    red: string;
    magenta: string;
    brown: string;
    lightGray: string;
    darkGray: string;
    lightBlue: string;
    lightGreen: string;
    lightCyan: string;
    lightRed: string;
    lightMagenta: string;
    yellow: string;
    white: string;
    hueBetween(fromInDeg: number, toInDeg: number, multipler?: number): number;
    hsl(hueInDeg?: number, saturationInPercent?: number, lightnessInPercent?: number, alpha?: number): string;
    hslRot(rotInRad: number): string;
    rgb(r255?: number, g255?: number, b255?: number, alpha?: number): string;
};
declare const getColor: (canvas: Canvas, coords: PointArg) => Uint8ClampedArray;
declare class ShapeTransformer {
    shape: Shape;
    constructor(shape: Shape);
    rotate(angle: number, pivot?: PointArg): ShapeTransformer;
    scale(sc: PointArg): ShapeTransformer;
    translate(offset: PointArg): ShapeTransformer;
}
declare const shape: {
    (shape: readonly (readonly [
        number,
        number
    ])[]): ShapeTransformer;
    make: {
        rect([x1, y1]?: readonly [
            number,
            number
        ], [x2, y2]?: readonly [
            number,
            number
        ], offsetHalf?: boolean): readonly (readonly [
            number,
            number
        ])[];
        ngon(n?: number): readonly (readonly [
            number,
            number
        ])[];
    };
    build: {
        ngon(n?: number): ShapeTransformer;
        rect(p1?: readonly [
            number,
            number
        ] | undefined, p2?: readonly [
            number,
            number
        ] | undefined, offsetHalf?: boolean): ShapeTransformer;
    };
    scale: (shp: readonly (readonly [
        number,
        number
    ])[], scale: PointArg) => readonly (readonly [
        number,
        number
    ])[];
    translate: (shp: readonly (readonly [
        number,
        number
    ])[], offset: PointArg) => readonly (readonly [
        number,
        number
    ])[];
    rotate: (shp: readonly (readonly [
        number,
        number
    ])[], angle: number, pivot?: PointArg) => readonly (readonly [
        number,
        number
    ])[];
};
declare const makeShape: {
    rect([x1, y1]?: readonly [
        number,
        number
    ], [x2, y2]?: readonly [
        number,
        number
    ], offsetHalf?: boolean): readonly (readonly [
        number,
        number
    ])[];
    ngon(n?: number): readonly (readonly [
        number,
        number
    ])[];
};
// TODO: Maybe, split fns to "fast" and "handy".
// Or maybe not (fast should be calculated separately then, without creating arrays)
declare const point: {
    round(point: readonly [
        number,
        number
    ]): readonly [
        number,
        number
    ];
    floor(point: readonly [
        number,
        number
    ]): readonly [
        number,
        number
    ];
    ceil(point: readonly [
        number,
        number
    ]): readonly [
        number,
        number
    ];
    add(...args: PointArg[]): readonly [
        number,
        number
    ];
    dist(a: readonly [
        number,
        number
    ], b?: readonly [
        number,
        number
    ]): number;
    neg([ax, ay]: readonly [
        number,
        number
    ]): readonly [
        number,
        number
    ];
    mul(...args: PointArg[]): readonly [
        number,
        number
    ];
    div([ax, ay]: readonly [
        number,
        number
    ], b: PointArg): readonly [
        number,
        number
    ];
    sub([ax, ay]: readonly [
        number,
        number
    ], b: PointArg): readonly [
        number,
        number
    ];
    get: (point: PointArg, default_?: readonly [
        number,
        number
    ]) => readonly [
        number,
        number
    ];
    scale([x, y]: readonly [
        number,
        number
    ], scale: PointArg, pivot?: PointArg): readonly [
        number,
        number
    ];
    mod([x, y]: readonly [
        number,
        number
    ], b: PointArg): readonly [
        number,
        number
    ];
    rotate([x, y]: readonly [
        number,
        number
    ], angle: number, pivot?: PointArg): readonly [
        number,
        number
    ];
    sizeToScale(currentSize: PointArg, targetSize: PointArg): readonly [
        number,
        number
    ];
};
declare const random: {
    range(min: number, max: number): number;
    iRange(min: number, max: number): number;
    m32(seed: number): number;
    m32p(xSeed: number, ySeed?: number): readonly [
        number,
        number
    ];
};
export { Canvas, EventListener, makeListener, Point, Points, PointArg, Shape, FillStyle, StrokeStyle, FontStyle, Corner, BoxPoint, Corners, Box, LineCap, Repeat, TWO_PI, DEG_TO_RAD, RAD_TO_DEG, PI_BY_TWO, SQR_TWO, REVISION, AnimateMethod, AnimateOptions, animate, osc, CGA, color, getColor, shape, makeShape, point, random };