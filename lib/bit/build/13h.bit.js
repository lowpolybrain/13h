'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var core = require('@13h/core');

const numberToBits = (num) => {
    return num
        .toString(2)
        .split('')
        .map((n) => (n == '1' ? 1 : 0));
};

class BitMap {
    bits;
    size;
    constructor(bits, size) {
        this.bits = bits;
        this.size = size;
    }
    drawPixels(c, pos, color = [255, 255, 255, 255]) {
        const [x, y] = core.point.get(pos);
        const target = c.context;
        const imgData = target.getImageData(x, y, this.size[0], this.size[1]);
        for (let i = 0; i < this.bits.length; i++) {
            if (this.bits[i]) {
                imgData.data[i * 4] = color[0];
                imgData.data[i * 4 + 1] = color[1];
                imgData.data[i * 4 + 2] = color[2];
                imgData.data[i * 4 + 3] = color[3];
            }
        }
    }
    static fromNumber(num, size) {
        return new BitMap(numberToBits(num), size);
    }
}

exports.BitMap = BitMap;
exports.numberToBits = numberToBits;
//# sourceMappingURL=13h.bit.js.map
