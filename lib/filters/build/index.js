'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

// TODO: Write in doc about alpha-premultiplication
const setColorTransparency = function (canvas, color, transparency1 = 1) {
    if (!color) {
        return null;
    }
    const transparency = Math.floor(transparency1 * 255);
    const [tr, tg, tb] = color;
    const [width, height] = canvas.size;
    const imageData = canvas.context.getImageData(0, 0, width, height);
    for (let i = 0; i < imageData.data.length; i += 4) {
        const r = imageData.data[i];
        const g = imageData.data[i + 1];
        const b = imageData.data[i + 2];
        if (tr === r && tg === g && tb === b) {
            imageData.data[i + 3] = transparency;
        }
    }
    canvas.context.putImageData(imageData, 0, 0);
};
const makeColorTransparent = function (canvas, color) {
    setColorTransparency(canvas, color, 0);
};

exports.makeColorTransparent = makeColorTransparent;
exports.setColorTransparency = setColorTransparency;
//# sourceMappingURL=index.js.map
