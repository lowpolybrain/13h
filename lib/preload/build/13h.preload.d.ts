import { Image } from '@13h/image';

declare type OnProgress = (image: Image, index: number, totalSuccess: number) => void;
declare const preloadImages: (images: Image[], onFinish: (images: Image[]) => void, onProgress?: OnProgress | undefined) => void;

export { preloadImages };
