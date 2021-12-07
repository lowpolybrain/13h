import { Image } from '../image/src';

type OnProgress = (image: Image, index: number, totalSuccess: number) => void;

export const preloadImages = (images: Image[], onFinish: (images: Image[]) => void, onProgress?: OnProgress) => {
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
