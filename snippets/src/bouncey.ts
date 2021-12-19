import { point, TWO_PI, color, getColor } from '@13h/core';
import { makeColorTransparent, setColorTransparency } from '@13h/filters';
import { FlyingBounce } from '@13h/gimmicks';
import { Image, FixedSprite } from '@13h/image';
import { preloadImages } from '@13h/preload';

import { makeCanvas, animate } from '../common';

const img = new Image('../assets/105909.png');
img.onError(console.log);

preloadImages([img], ([sprite]) => {
  const canvas = makeCanvas(512);
  const spriteCanvas = sprite!.createCanvas([0, 16], [16 * 6, 32]);
  setColorTransparency(spriteCanvas, getColor(spriteCanvas, [12, 14]), 0.5);
  makeColorTransparent(spriteCanvas, getColor(spriteCanvas, 0));

  const as = 2;
  const animation = new FixedSprite(spriteCanvas, [16, 16]);
  const animationBounce = new FlyingBounce(FlyingBounce.randomDirection(5), 16 * as, canvas.size, canvas.center);

  const bounces = new Array(40).fill(0).map(() => {
    const rot = Math.random() * TWO_PI;
    return new FlyingBounce<string>(point.rotate([0.001, 0], rot), 0.005).setPayload(color.hslRot(rot)).rewind(400);
  });

  animate((n: number) => {
    canvas.fill('#111').crisp().poly(canvas.getContour(true), undefined, 1, '#0f0');

    bounces.forEach((bounce) => {
      bounce.next();
      const rect = point.mul(canvas.size, bounce.size);
      const pos = point.mul(canvas.size, bounce.position);
      canvas.rect(pos, point.add(pos, rect), bounce.payload);
    });

    animationBounce.next();
    animation
      .setSpriteIndex(Math.floor(n / 10) % animation.lastFrameIndex)
      .draw(canvas, animationBounce.position, 0, as);
  });
});
