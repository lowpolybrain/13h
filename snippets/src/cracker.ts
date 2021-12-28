import { makeScene } from './inc/boilerplate';
import { random } from '@13h/core';

makeScene(
  (canvas, n) => {
    if (!(n % 10)) {
      canvas.fade(0.2);
    }
    for (let i = 0; i < 10; i++) {
      canvas.line(canvas.center, random.pointRot(canvas.small / 2, canvas.center), '#fff', 2);
    }
    for (let i = 0; i < 10; i++) {
      canvas.line(canvas.center, random.pointRot(canvas.small / 4, canvas.center), '#f00', 4);
    }
  },
  { initialSkip: 20 }
);
