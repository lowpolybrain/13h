'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var core = require('@13h/core');

/** turn screen coordinates to canvas local coordinates */
const coordsToLocal = (c, offsetCoords) => {
    const realWidth = c.element.offsetWidth;
    const realHeight = c.element.offsetHeight;
    return [c.size[0] * (offsetCoords[0] / realWidth), c.size[1] * (offsetCoords[1] / realHeight)];
};

/** Tracking mouse position in canvas coordinates */
class MouseTracker {
    constructor(c) {
        if (c) {
            this.mount(c);
        }
    }
    /** Real position (relative to upper left corner of the element) */
    realPos = [0, 0];
    /** Position in canvas coordinates */
    pos = [0, 0];
    mount(c) {
        this.unmount();
        this.mountedCanvas = c;
        c.element.addEventListener('mousemove', this.mouseMove);
    }
    isMounted() {
        return !!this.mountedCanvas;
    }
    unmount() {
        if (this.mountedCanvas) {
            this.mountedCanvas.element.removeEventListener('mousemove', this.mouseMove);
            this.mountedCanvas = undefined;
        }
    }
    /// ---
    mountedCanvas;
    mouseMove = (e) => {
        if (this.mountedCanvas) {
            this.realPos = [e.offsetX, e.offsetY];
            this.pos = coordsToLocal(this.mountedCanvas, this.realPos);
        }
    };
}

exports.LockState = void 0;
(function (LockState) {
    LockState[LockState["Unlocked"] = 0] = "Unlocked";
    LockState[LockState["Pending"] = 1] = "Pending";
    LockState[LockState["Locked"] = 2] = "Locked";
})(exports.LockState || (exports.LockState = {}));
class MouseCapture {
    constructor(c) {
        if (c) {
            this.mount(c);
        }
    }
    get isMounted() {
        return !!this.mountedCanvas;
    }
    setPos(newPos) {
        this.pos = core.point.clamp(newPos, core.point.zero, [Infinity, Infinity]);
        this.unClampedPos = newPos;
    }
    /** Position in canvas coordinates */
    unClampedPos = [0, 0];
    pos = [0, 0];
    mount(c) {
        this.unmount();
        this.mountedCanvas = c;
        this.pos = core.point.clamp(this.pos, core.point.zero, c.maxPoint);
        c.element.addEventListener('click', this.handleClick);
        c.element.addEventListener('pointerup', this.handleUnlock);
        document.addEventListener('pointerlockchange', this.handlePointerLockChange);
        document.addEventListener('pointerlockerror', this.handleUnlock);
    }
    unmount() {
        if (this.mountedCanvas) {
            this.mountedCanvas.element.removeEventListener('click', this.handleClick);
            this.mountedCanvas.element.removeEventListener('pointerup', this.handleUnlock);
            document.removeEventListener('pointerlockchange', this.handlePointerLockChange);
            document.removeEventListener('pointerlockerror', this.handleUnlock);
            this.mountedCanvas.element.removeEventListener('mousemove', this.handleMouseMove);
        }
        this.mountedCanvas = undefined;
    }
    lockState = exports.LockState.Unlocked;
    /// ---
    handlePointerLockChange = () => {
        if (this.lockState === exports.LockState.Pending) {
            this.lockState = exports.LockState.Locked;
            this.mountedCanvas?.element.addEventListener('mousemove', this.handleMouseMove);
        }
        else {
            this.lockState = exports.LockState.Unlocked;
            this.mountedCanvas?.element.removeEventListener('mousemove', this.handleMouseMove);
        }
    };
    handleClick = async (e) => {
        if (this.mountedCanvas && this.lockState === exports.LockState.Unlocked) {
            this.lockState = exports.LockState.Pending;
            try {
                await this.mountedCanvas.element.requestPointerLock();
            }
            catch (e) {
                this.lockState = exports.LockState.Unlocked;
            }
        }
    };
    handleUnlock = () => {
        this.lockState = exports.LockState.Unlocked;
    };
    handleMouseMove = (e) => {
        if (this.lockState === exports.LockState.Locked && this.mountedCanvas) {
            const realDelta = [e.movementX, e.movementY];
            this.unClampedPos = core.point.add(this.pos, coordsToLocal(this.mountedCanvas, realDelta));
            this.pos = core.point.clamp(core.point.add(this.pos, coordsToLocal(this.mountedCanvas, realDelta)), core.point.zero, this.mountedCanvas.maxPoint);
        }
    };
    mountedCanvas;
}

exports.MouseCapture = MouseCapture;
exports.MouseTracker = MouseTracker;
exports.coordsToLocal = coordsToLocal;
//# sourceMappingURL=13h.controls.js.map
