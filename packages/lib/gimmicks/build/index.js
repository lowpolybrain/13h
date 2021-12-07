'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var core = require('@13h/core');

class FlyingBounce {
    constructor(speed, size = 0.01, borderSize = 1, startPos) {
        this.step = 0;
        this.speed = core.point.get(speed, FlyingBounce.randomDirection(Math.random() * 0.01 + 0.01));
        this.size = core.point.get(size);
        this.borderSize = core.point.get(borderSize);
        this.position = core.point.get(startPos, core.point.mul(this.borderSize, 0.5));
    }
    setPayload(pl) {
        this.payload = pl;
        return this;
    }
    hitTest(nextPos) {
        const [px, py] = nextPos;
        const [zx, zy] = this.size;
        const [bx, by] = this.borderSize;
        const hitTop = py < 0;
        const hitBottom = py + zy > by;
        const hitLeft = px < 0;
        const hitRight = px + zx > bx;
        if (hitTop || hitBottom || hitLeft || hitRight) {
            return [hitLeft || hitRight ? -1 : 1, hitTop || hitBottom ? -1 : 1];
        }
        return null;
    }
    next() {
        const [px, py] = this.position;
        const [sx, sy] = this.speed;
        const nextPos = [px + sx, py + sy];
        const bounce = this.hitTest(nextPos);
        if (bounce) {
            this.speed[0] = this.speed[0] * bounce[0];
            this.speed[1] = this.speed[1] * bounce[1];
        }
        else {
            this.position[0] = nextPos[0];
            this.position[1] = nextPos[1];
        }
        this.step += 1;
    }
    rewind(steps) {
        for (let i = 0; i < steps; i++) {
            this.next();
        }
        return this;
    }
    static randomDirection(speed) {
        return core.point.rotate([speed, 0], Math.random() * core.TWO_PI);
    }
    static speedDirection(speed, rotInRad) {
        return core.point.rotate([speed, 0], rotInRad);
    }
}

const whiteNoise = (c) => {
    const data = c.context.getImageData(0, 0, c.width, c.height);
    const max = c.width * c.height;
    for (let i = 0; i < max; i++) {
        const rnd = Math.round(Math.random() * 255);
        data.data[i * 4] = rnd;
        data.data[i * 4 + 1] = rnd;
        data.data[i * 4 + 2] = rnd;
        data.data[i * 4 + 3] = 255;
    }
    c.context.putImageData(data, 0, 0);
};

exports.FlyingBounce = FlyingBounce;
exports.whiteNoise = whiteNoise;
//# sourceMappingURL=index.js.map
