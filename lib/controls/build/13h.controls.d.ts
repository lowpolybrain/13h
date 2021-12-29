import { Canvas, Point } from '@13h/core';

/** Tracking mouse position in canvas coordinates */
declare class MouseTracker {
    constructor(c?: Canvas);
    /** Real position (relative to upper left corner of the element) */
    realPos: Point;
    /** Position in canvas coordinates */
    pos: Point;
    mount(c: Canvas): void;
    isMounted(): boolean;
    unmount(): void;
    private mountedCanvas?;
    private mouseMove;
}

declare enum LockState {
    Unlocked = 0,
    Pending = 1,
    Locked = 2
}
declare class MouseCapture {
    constructor(c?: Canvas);
    get isMounted(): boolean;
    setPos(newPos: Point): void;
    /** Position in canvas coordinates */
    unClampedPos: Point;
    pos: Point;
    mount(c: Canvas): void;
    unmount(): void;
    lockState: LockState;
    private handlePointerLockChange;
    private handleClick;
    private handleUnlock;
    private handleMouseMove;
    private mountedCanvas?;
}

/** turn screen coordinates to canvas local coordinates */
declare const coordsToLocal: (c: Canvas, offsetCoords: readonly [number, number]) => readonly [number, number];

export { LockState, MouseCapture, MouseTracker, coordsToLocal };
