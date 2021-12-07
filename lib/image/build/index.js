'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var core = require('@13h/core');

class Image {
    constructor(url, options = {}) {
        this.url = url;
        this._isReady = false;
        this._size = [0, 0];
        this._center = [0, 0];
        this._pivot = [0, 0];
        this.onLoad = core.makeListener(true, true);
        this.element = document.createElement('img');
        this.element.src = url;
        if (options.crossOrigin || options.crossOrigin === undefined) {
            this.element.crossOrigin = 'Anonymous';
        }
        this.element.addEventListener('load', () => {
            this._isReady = true;
            const { width, height } = this.element;
            this._size = [width, height];
            this._center = [width / 2, height / 2];
            this.onLoad.fire(this);
        });
    }
    get pivot() {
        return this._pivot;
    }
    get size() {
        return this._size;
    }
    get height() {
        return this._size[1];
    }
    get width() {
        return this._size[0];
    }
    get cx() {
        return this._size[0] / 2;
    }
    get cy() {
        return this._size[1] / 2;
    }
    get center() {
        return this._center;
    }
    setSize([width, height]) {
        this._size = [width, height];
        this._center = [width / 2, height / 2];
        this.element.width = width;
        this.element.height = height;
        return this;
    }
    get isReady() {
        return this._isReady;
    }
    draw(destination, [x, y] = [0, 0], rotation, scale = 1, alpha = 1) {
        const scl = core.point.get(scale);
        // TODO: Take smoothing into account
        destination.context.save();
        const [px, py] = this.pivot;
        destination.context.globalAlpha = alpha;
        if (!rotation && !scl && !rotation) {
            destination.context.drawImage(this.element, x - px, y - py);
        }
        else {
            if (x || y) {
                destination.context.translate(x, y);
            }
            if (rotation) {
                destination.context.rotate(rotation);
            }
            if (scl) {
                destination.context.scale(scl[0], scl[1]);
            }
            destination.context.translate(-px, -py);
            destination.context.drawImage(this.element, 0, 0);
            // destination.context.setTransform(1, 0, 0, 1, 0, 0); // TODO: Is this needed?
            // TODO: Maybe, use setTransform for translate/rotate/scl
        }
        destination.context.restore();
        return this;
    }
    createCanvas(cropStart, cropEnd) {
        const [sx, sy] = core.point.get(cropStart);
        const [ex, ey] = core.point.get(cropEnd, this.size);
        const canvas = new core.Canvas([ex - sx, ey - sy]);
        canvas.context.drawImage(this.element, -sx, -sy); // TODO: Benchmark fastest way of doing this
        return canvas;
    }
}

class FixedSprite {
    constructor(image, size, spriteNum) {
        this.image = image;
        this.spriteNum = spriteNum;
        this.spriteIndex = 0;
        this.size = core.point.get(size);
        this._sprite = new core.Canvas(size);
        this.setSpriteIndex(0);
    }
    setSpriteIndex(index) {
        this.spriteIndex = index;
        this._sprite.clear();
        const [nx, ny] = this.getSpriteNum();
        const max = nx * ny;
        if (index < max && index >= 0) {
            const [xs, ys] = this.size;
            const xi = index % nx;
            const yi = Math.floor(index / nx);
            this._sprite.context.drawImage(this.image.element, -xi * xs, -yi * ys);
        }
        return this;
    }
    get lastFrameIndex() {
        const [nx, ny] = this.getSpriteNum();
        return nx * ny - 1;
    }
    nextSprite() {
        const nextSpriteIndex = (this.spriteIndex + 1) % this.lastFrameIndex;
        this.setSpriteIndex(nextSpriteIndex);
        return this;
    }
    draw(destination, pos, rotation, scale, alpha) {
        this._sprite.draw(destination, pos, rotation, scale, alpha);
        return this;
    }
    getSpriteNum() {
        if (this.spriteNum) {
            return this.spriteNum;
        }
        const [w, h] = this.image.size;
        return [Math.floor(w / this.size[0]), Math.floor(h / this.size[1])];
    }
    getDebugCanvas() {
        const debugCanvas = this.image instanceof core.Canvas ? this.image.copy() : this.image.createCanvas();
        const [sx, sy] = this.size;
        const [nx, ny] = this.getSpriteNum();
        const w = sx * nx;
        const h = sy * ny;
        for (let ix = 0; ix <= nx; ix += 1) {
            const x = ix * sx;
            debugCanvas.line([x - 0.5, 0], [x - 0.5, h], '#0f05', 1);
            debugCanvas.line([x + 0.5, 0], [x + 0.5, h], '#f005', 1);
        }
        for (let iy = 0; iy <= ny; iy += 1) {
            const y = iy * sy;
            debugCanvas.line([0, y - 0.5], [w, y + 0.5], '#ff05', 1);
            debugCanvas.line([0, y + 0.5], [w, y + 0.5], '#00f5', 1);
        }
        debugCanvas.text(nx + 'x' + ny, [3, 3], '#000');
        debugCanvas.text(nx + 'x' + ny, [2.5, 2.5], '#fff');
        return debugCanvas;
    }
}

exports.FixedSprite = FixedSprite;
exports.Image = Image;
//# sourceMappingURL=index.js.map
