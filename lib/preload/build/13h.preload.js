'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

const preloadImages = (images, onFinish, onProgress) => {
    let loaded = 0;
    for (let i = 0; i < images.length; i++) {
        const image = images[i];
        image.onLoad(function () {
            loaded += 1;
            if (onProgress) {
                onProgress(image, i, loaded);
            }
            if (loaded === images.length) {
                onFinish(images);
            }
        });
    }
};

exports.preloadImages = preloadImages;
//# sourceMappingURL=13h.preload.js.map
