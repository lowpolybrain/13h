import { makeScene } from './inc/boilerplate';
import { Canvas, osc, point } from '@13h/core';

const canvas = new Canvas(512);
canvas.fill('#f00');

makeScene(
  (screenCanvas, n) => {
    canvas.dot(osc.sinCos(n / 100, canvas.size, osc.sin(n, 20) + 20), '#f00');
    canvas.fade(0.2);
    canvas.centerPivot().draw(screenCanvas.clear(), screenCanvas.center);
  }
);
