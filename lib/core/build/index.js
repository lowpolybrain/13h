'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

const animate = function (nextFrame, options = {}) {
    let renderedFrame = 0;
    let frameSkipCounter = 0;
    let setCleanup;
    if (options.cleanupId) {
        if (!window._cdeCleanup) {
            window._cdeCleanup = {};
        }
        else {
            const frameId = window._cdeCleanup[options.cleanupId];
            if (frameId) {
                console.log('Cancelled', frameId);
                window.cancelAnimationFrame(frameId);
            }
        }
        setCleanup = (cleanupNum) => {
            if (window._cdeCleanup && options.cleanupId) {
                window._cdeCleanup[options.cleanupId] = cleanupNum;
            }
        };
    }
    const renderNextFrame = (time) => {
        if (options.frameSkip != null && options.frameSkip > 0) {
            frameSkipCounter = (frameSkipCounter + 1) % options.frameSkip;
            if (!frameSkipCounter) {
                nextFrame(renderedFrame++, time);
            }
        }
        else {
            nextFrame(renderedFrame++, time);
        }
    };
    if (options.initialSkip != null && options.initialSkip > 0) {
        for (let i = 0; i < options.initialSkip; i++) {
            renderNextFrame(0);
        }
    }
    const rqAnimFrame = (fn) => {
        const id = window.requestAnimationFrame(fn);
        if (setCleanup) {
            setCleanup(id);
        }
    };
    const goToNextFrame = (n) => {
        if (options.frameRepeat) {
            for (let i = 0; i <= options.frameRepeat; i++) {
                renderNextFrame(n);
            }
        }
        else {
            renderNextFrame(n);
        }
        rqAnimFrame(goToNextFrame);
    };
    rqAnimFrame(goToNextFrame);
};

const osc = {
    sin: function (t, max) {
        return (Math.sin(t) * max) / 2 + max / 2;
    },
    cos: function (t, max) {
        return (Math.cos(t) * max) / 2 + max / 2;
    }
};

const getPoint = function (point, default_ = [0, 0]) {
    if (point == null) {
        return [default_[0], default_[1]];
    }
    return typeof point === 'number'
        ? [point, point]
        : [point[0], point[1]];
};
// TODO: Maybe, split fns to "fast" and "handy".
// Or maybe not (fast should be calculated separately then, without creating arrays)
const point = {
    round(point) {
        return [Math.round(point[0]), Math.round(point[1])];
    },
    floor(point) {
        return [Math.round(point[0]), Math.floor(point[1])];
    },
    ceil(point) {
        return [Math.round(point[0]), Math.ceil(point[1])];
    },
    add(...args) {
        let sx = 0;
        let sy = 0;
        for (let i = 0; i < args.length; i++) {
            const [ax, ay] = point.get(args[i]);
            sx += ax;
            sy += ay;
        }
        return [sx, sy];
    },
    dist(a, b = [0, 0]) {
        const dx = a[0] - b[0];
        const dy = a[1] - b[1];
        return Math.sqrt(dx * dx + dy * dy);
    },
    neg([ax, ay]) {
        return [-ax, -ay];
    },
    mul(...args) {
        let mx = 1;
        let my = 1;
        for (let i = 0; i < args.length; i++) {
            const [x, y] = getPoint(args[i]);
            mx *= x;
            my *= y;
        }
        return [mx, my];
    },
    div([ax, ay], b) {
        const [bx, by] = getPoint(b);
        return [ax / bx, ay / by];
    },
    sub([ax, ay], b) {
        const [bx, by] = getPoint(b);
        return [ax - bx, ay - by];
    },
    get: getPoint,
    scale([x, y], scale, pivot) {
        const [sx, sy] = getPoint(scale);
        const [px, py] = getPoint(pivot);
        return [(x - px) * sx + py, (y - py) * sy + py];
    },
    mod([x, y], b) {
        const [bx, by] = getPoint(b);
        return [x % bx, y % by];
    },
    rotate([x, y], angle, pivot) {
        const [px, py] = getPoint(pivot || [0, 0]);
        const sin = Math.sin(angle);
        const cos = Math.cos(angle);
        return [
            sin * (x - px) + cos * (y - py) + px,
            sin * (y - py) - cos * (x - px) + py
        ];
    },
    sizeToScale(currentSize, targetSize) {
        const cs = point.get(currentSize);
        if (cs[0] === 0 || cs[1] === 0)
            return [0, 0];
        const ts = point.get(targetSize);
        return [ts[0] / cs[0], ts[1] / cs[1]];
    }
};

const TWO_PI = Math.PI * 2;
const DEG_TO_RAD = Math.PI / 180;
const RAD_TO_DEG = 180 / Math.PI;
const PI_BY_TWO = Math.PI / 2;
const SQR_TWO = Math.sqrt(2);
const REVISION = 2;

const CGA = {
    black: '#000000',
    blue: '#00A',
    green: '#0A0',
    cyan: '#0A0',
    red: '#A00',
    magenta: '#A0A',
    brown: '#A50',
    lightGray: '#AAA',
    darkGray: '#555',
    lightBlue: '#55f',
    lightGreen: '#5f5',
    lightCyan: '#5F5',
    lightRed: '#F55',
    lightMagenta: '#F5F',
    yellow: '#FF5',
    white: '#FFF'
};
const color = {
    // TODO: Refactor this horrible clusterfuck
    // Hue between two hues. Last parameter defines whether
    // in degrees (360), radians (TWO_PI) or just from 0 to 1 (1)
    hueBetween(fromInDeg, toInDeg, multipler = 360) {
        const aaa = fromInDeg > multipler
            ? fromInDeg % multipler
            : fromInDeg;
        const bbb = toInDeg > multipler ? toInDeg % multipler : toInDeg;
        const aa = aaa / multipler;
        const baa = bbb / multipler;
        const [a, ba] = aa < baa ? [aa, baa] : [baa, aa];
        const d = (a + ba) / 2;
        return d * multipler;
    },
    hsl(hueInDeg = 0, saturationInPercent = 100, lightnessInPercent = 50, alpha = 1) {
        return alpha < 1
            ? `hsla(${hueInDeg}, ${saturationInPercent}%, ${lightnessInPercent}%, ${alpha})`
            : `hsl(${hueInDeg}, ${saturationInPercent}%, ${lightnessInPercent}%)`;
    },
    hslRot(rotInRad) {
        return color.hsl(Math.round(rotInRad * RAD_TO_DEG));
    },
    rgb(r255 = 0, g255 = r255, b255 = r255, alpha = 1) {
        return alpha < 1
            ? `rgba(${r255},${g255},${b255}, ${alpha})`
            : `rgba(${r255},${g255},${b255})`;
    },
    ...CGA
};
const getColor = function (canvas, coords) {
    const [x, y] = point.get(coords);
    return canvas.context.getImageData(x, y, 1, 1).data;
};

const rotate = function (shp, angle, pivot) {
    const pvt = point.get(pivot);
    const rotatedShape = [];
    for (let i = 0; i < shp.length; i++) {
        rotatedShape.push(point.rotate(shp[i], angle, pvt));
    }
    return shp.map((dim) => point.rotate(dim, angle, pvt));
};
const scale = function (shp, scale) {
    const scl = point.get(scale);
    const scaledShape = [];
    for (let i = 0; i < shp.length; i++) {
        scaledShape.push(point.scale(shp[i], scl));
    }
    return scaledShape;
};
const translate = function (shp, offset) {
    const off = point.get(offset);
    const translatedShape = [];
    for (let i = 0; i < shp.length; i++) {
        translatedShape.push([
            shp[i][0] + off[0],
            shp[i][1] + off[1]
        ]);
    }
    return translatedShape;
};
class ShapeTransformer {
    shape;
    constructor(shape) {
        this.shape = shape;
    }
    rotate(angle, pivot) {
        return new ShapeTransformer(rotate(this.shape, angle, pivot));
    }
    scale(sc) {
        return new ShapeTransformer(scale(this.shape, sc));
    }
    translate(offset) {
        return new ShapeTransformer(translate(this.shape, offset));
    }
}
const shape = function (shape) {
    return new ShapeTransformer(shape);
};
const makeShape = {
    rect([x1, y1] = [0, 0], [x2, y2] = [0, 0], offsetHalf = true) {
        const offset = offsetHalf ? 0 : 0.5;
        return [
            [x1 + offset, y1 + offset],
            [x2 - offset, y1 + offset],
            [x2 - offset, y2 - offset],
            [x1 + offset, y2 - offset]
        ];
    },
    ngon(n = 3) {
        const points = [];
        const step = TWO_PI / n;
        for (let i = 0; i < n; i += 1) {
            points.push([Math.sin(i * step), Math.cos(i * step)]);
        }
        return points;
    }
};
const shapeBuilder = {
    ngon(n = 3) {
        return shape(makeShape.ngon(n));
    },
    rect(p1, p2, offsetHalf = true) {
        return shape(makeShape.rect(p1, p2, offsetHalf));
    }
};
shape.make = makeShape;
shape.build = shapeBuilder;
shape.scale = scale;
shape.translate = translate;
shape.rotate = rotate;
// TODO: Also an api shp(shp).scale().whatever()

const random = {
    range(min, max) {
        return Math.random() * (max - min) + min;
    },
    iRange(min, max) {
        return Math.round(random.range(min, max));
    },
    m32(seed) {
        let t = seed + 0x6d2b79f5;
        t = Math.imul(t ^ (t >>> 15), t | 1);
        t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
        return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    },
    m32p(xSeed, ySeed = xSeed + 16000) {
        return [random.m32(xSeed), random.m32(ySeed)];
    }
};

exports.Corner = void 0;
(function (Corner) {
    Corner["TopLeft"] = "topLeft";
    Corner["TopRight"] = "topRight";
    Corner["BottomRight"] = "bottomRight";
    Corner["BottomLeft"] = "bottomLeft";
})(exports.Corner || (exports.Corner = {}));
exports.BoxPoint = void 0;
(function (BoxPoint) {
    BoxPoint["Center"] = "center";
    BoxPoint["TopLeft"] = "topLeft";
    BoxPoint["TopRight"] = "topRight";
    BoxPoint["BottomRight"] = "bottomRight";
    BoxPoint["BottomLeft"] = "bottomLeft";
})(exports.BoxPoint || (exports.BoxPoint = {}));

exports.LineCap = void 0;
(function (LineCap) {
    LineCap["Butt"] = "butt";
    LineCap["Round"] = "round";
    LineCap["Square"] = "square";
})(exports.LineCap || (exports.LineCap = {}));

exports.Repeat = void 0;
(function (Repeat) {
    Repeat["XY"] = "repeat";
    Repeat["X"] = "repeat-x";
    Repeat["Y"] = "repeat-y";
    Repeat["None"] = "no-repeat";
})(exports.Repeat || (exports.Repeat = {}));

// TODO: Make sure the class does not use its own getters
class Canvas {
    strokeFill(fillStyle, lineWidth, strokeStyle, closePath) {
        if (closePath)
            this.context.closePath();
        if (lineWidth)
            this.context.lineWidth = lineWidth;
        if (fillStyle)
            this.context.fillStyle = fillStyle;
        if (strokeStyle)
            this.context.strokeStyle = strokeStyle;
        if (lineWidth || strokeStyle)
            this.context.stroke();
        if (fillStyle)
            this.context.fill();
    }
    element;
    context;
    _size = [0, 0];
    _center = [0, 0];
    _pivot = [0, 0];
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
    getCorners(offsetHalf = false) {
        const offset = offsetHalf ? 0.5 : 1;
        return {
            [exports.Corner.TopLeft]: [offset, offset],
            [exports.Corner.TopRight]: [this.width - offset, offset],
            [exports.Corner.BottomRight]: [this.width - offset, this.height - offset],
            [exports.Corner.BottomLeft]: [offset, this.height - offset],
        };
    }
    getContour(offsetHalf = false) {
        return Object.values(this.getCorners(offsetHalf));
    }
    constructor(size, target) {
        const [width, height] = point.get(size);
        this.element = document.createElement('canvas');
        const context = this.element.getContext('2d');
        if (!context) {
            throw new Error('Could not retrieve canvas context. Are you on web?');
        }
        this.context = context;
        this.setSize([width, height]);
        if (target) {
            this.appendTo(target);
        }
    }
    appendTo(target) {
        target.appendChild(this.element);
        return this;
    }
    setSize([width, height]) {
        this._size = [width, height];
        this._center = [width / 2, height / 2];
        this.element.width = width;
        this.element.height = height;
        return this;
    }
    setPivot([width, height]) {
        this._pivot = [width, height];
        return this;
    }
    centerPivot() {
        return this.setPivot(this._center);
    }
    rect([x1, y1], [x2, y2], fill) {
        this.setFillStyle(fill);
        if (x1 !== x2 && y1 !== y2) {
            const sx = x1 < x2 ? x2 - x1 : x1 - x2;
            const sy = y1 < y2 ? y2 - y1 : y1 - y2;
            const px = x1 < x2 ? x1 : x2;
            const py = y1 < y2 ? y1 : y2;
            this.context.fillRect(px, py, sx, sy);
        }
        return this;
    }
    dot([x, y], color, size = 1) {
        if (color) {
            this.context.fillStyle = color;
        }
        const fl = Math.floor(size / 2);
        this.context.fillRect(x - fl, y - fl, size, size);
        return this;
    }
    setFillStyle(fillStyle) {
        if (fillStyle) {
            this.context.fillStyle = fillStyle;
        }
        return this;
    }
    fill(fillStyle) {
        this.setFillStyle(fillStyle);
        this.context.fillRect(0, 0, this.width, this.height);
        return this;
    }
    clear() {
        this.context.clearRect(0, 0, this.width, this.height);
        return this;
    }
    // TODO: Refactor maybe
    crisp() {
        this.context.imageSmoothingEnabled = false;
        this.element.style.imageRendering = 'pixelated';
        return this;
    }
    // TODO: Rid of C0DEFF past :D
    draw(destination, [x, y] = [0, 0], rotation, scale = 1, alpha = 1) {
        const scl = point.get(scale);
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
    line(a, b, color, width = 1) {
        this.poly([point.get(a), point.get(b)], 'transparent', width, color, false);
        return this;
    }
    createPattern(c, repetition = exports.Repeat.XY) {
        if (c instanceof Canvas) {
            return this.context.createPattern(c.element, repetition);
        }
        return this.context.createPattern(c, repetition);
    }
    poly(shape, fillStyle, lineWidth = 1, strokeColor, closePath = true, lineCap = exports.LineCap.Butt) {
        this.context.lineCap = lineCap;
        this.context.beginPath();
        this.context.moveTo(shape[0][0], shape[0][1]);
        for (var i = 1; i < shape.length; i++) {
            this.context.lineTo(shape[i][0], shape[i][1]);
        }
        this.strokeFill(fillStyle, lineWidth, strokeColor, closePath);
        return this;
    }
    copy(cropStart, cropEnd) {
        const [sx, sy] = point.get(cropStart);
        const [ex, ey] = point.get(cropEnd, this.size);
        const clone = new Canvas([ex - sx, ey - sy]);
        clone.context.drawImage(this.element, -sx, -sy); // TODO: Benchmark fastest way of doing this
        return clone;
    }
    // TODO: Split this
    get text() {
        const that = this;
        let setTextAlign = 'start';
        let setBaseLine = 'top';
        const textMaker = function (text, [x, y] = [10, 10], fill) {
            const oldTextAlign = that.context.textAlign;
            const oldTextBaseline = that.context.textBaseline;
            that.context.textAlign = setTextAlign;
            that.context.textBaseline = setBaseLine;
            that.setFillStyle(fill);
            that.context.fillText(`${text}`, x, y);
            that.context.textAlign = oldTextAlign;
            that.context.textBaseline = oldTextBaseline;
            return that;
        };
        Object.defineProperty(textMaker, 'center', {
            get: function () {
                setTextAlign = 'center';
                setBaseLine = 'middle';
                return textMaker;
            },
        });
        //@ts-expect-error TODO: Learn how to make defineProperty work TS way.
        return textMaker;
    }
}

class EventListener {
    fireOnAdd;
    happensOnce;
    timesFired = 0;
    constructor(
    // If event has been fired, on adding handler - it will be called
    // (will also be added to handlers)
    fireOnAdd = false, 
    // The event fires only once
    happensOnce = false) {
        this.fireOnAdd = fireOnAdd;
        this.happensOnce = happensOnce;
    }
    handlers = [];
    addHandler(eh) {
        if (this.fireOnAdd && this.timesFired > 0 && this.lastArgs) {
            eh.apply(this, this.lastArgs);
        }
        this.handlers.push(eh);
    }
    lastArgs;
    fire(...args) {
        if (!this.happensOnce || this.timesFired === 0) {
            this.timesFired += 1;
            this.lastArgs = args;
            for (let i = 0; i < this.handlers.length; i++) {
                this.handlers[i].apply(this, args);
            }
        }
    }
}
const makeListener = function (fireOnAdd = false, happensOnce = false) {
    const listener = new EventListener(fireOnAdd, happensOnce);
    const adder = function (handler) {
        listener.addHandler(handler);
    };
    adder.fire = function (...args) {
        listener.fire(...args);
    };
    return adder;
};

exports.CGA = CGA;
exports.Canvas = Canvas;
exports.DEG_TO_RAD = DEG_TO_RAD;
exports.EventListener = EventListener;
exports.PI_BY_TWO = PI_BY_TWO;
exports.RAD_TO_DEG = RAD_TO_DEG;
exports.REVISION = REVISION;
exports.SQR_TWO = SQR_TWO;
exports.TWO_PI = TWO_PI;
exports.animate = animate;
exports.color = color;
exports.getColor = getColor;
exports.makeListener = makeListener;
exports.makeShape = makeShape;
exports.osc = osc;
exports.point = point;
exports.random = random;
exports.shape = shape;
//# sourceMappingURL=index.js.map
