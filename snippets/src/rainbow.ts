import { color } from '@13h/core';
import { makeCanvas } from './inc/boilerplate';

const canvas = makeCanvas(256);

const draw = () => {
  let pos = 104;
  const test = (from: number, to: number) => {
    canvas.text(`${from}:${to}=${color.hueBetween(from, to)}`, [10, pos], '#fff');
    pos += 10;
  };

  canvas.fill('#111');
  const step = canvas.width / 4;

  for (let i = 0; i < canvas.width; i += step) {
    const clr = color.hsl((i / canvas.width) * 360);
    canvas.rect([i, 0], [i + step, 32], clr);
  }

  for (let i = 0; i < canvas.width; i += step) {
    const from = (i / canvas.width) * 360;
    const to = ((i + step) / canvas.width) * 360;
    const diff = color.hueBetween(from, to);
    test(from, to);

    const clrFrom = color.hsl(from);
    const clrBetween = color.hsl(diff);

    canvas.rect([i, 32], [i + step / 2, 64], clrFrom);
    canvas.rect([i + step / 2, 32], [i + step, 64], clrBetween);
  }

  for (let i = canvas.width; i >= 0; i -= step) {
    const from = (i / canvas.width) * 360;
    const to = ((i + step) / canvas.width) * 360;
    const diff = color.hueBetween(from, to);
    test(from, to);

    const clrFrom = color.hsl(from);
    const clrBetween = color.hsl(diff);

    canvas.rect([i, 64], [i + step / 2, 96], clrFrom);
    canvas.rect([i + step / 2, 64], [i + step, 96], clrBetween);
  }

  test(45, 135);
  test(0, 0);
  test(90, 180);
  test(90, 270);
};

draw();
