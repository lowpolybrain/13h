import { angleBetween, color, DEG_TO_RAD, Point, RAD_TO_DEG, TWO_PI } from '@13h/core';
import { makeCanvas } from './inc/boilerplate';

const canvas = makeCanvas(512);

const draw = () => {
  let hOffset = 104;
  const fs = 10;
  const test = (from: number, to: number, between: number, prefix: string = '') => {
    canvas.context.font = `normal ${fs}px monospace`;
    const pos: Point = [0.5, hOffset + 0.5];
    const fromText = `${from}`;
    const toText = `${to}`;
    const betweenText = `${between}`;
    canvas.text(prefix, pos, '#444');
    canvas.text(`${' '.repeat(prefix.length)}${fromText}`, pos, color.hsl(from));
    canvas.text(`${' '.repeat(prefix.length + fromText.length + toText.length + 5)}=`, pos, '#fff');
    canvas.text(`${' '.repeat(prefix.length + fromText.length)} -> ${toText}`, pos, color.hsl(to));
    canvas.text(
      `${' '.repeat(prefix.length + fromText.length + toText.length + 7)}${betweenText}`,
      pos,
      color.hsl(between)
    );
    hOffset += fs + 1;
  };

  canvas.fill('#111');
  const step = canvas.width / 8;

  for (let i = 0; i < canvas.width; i += step) {
    const clr = color.hsl((i / canvas.width) * 360);
    canvas.rect([i, 0], [i + step, 32], clr);
  }

  for (let i = 0; i < canvas.width; i += step) {
    const from = (i / canvas.width) * 360;
    const to = ((i + step) / canvas.width) * 360;
    const diff = color.hueBetween(from, to);
    test(from, to, diff, 'hue ');

    const clrFrom = color.hsl(from);
    const clrBetween = color.hsl(diff);

    canvas.rect([i, 32], [i + step / 2, 64], clrFrom);
    canvas.rect([i + step / 2, 32], [i + step, 64], clrBetween);
  }

  for (let i = 0; i < canvas.width; i += step) {
    const from = (i / canvas.width) * 360;
    const to = ((i + step) / canvas.width) * 360;
    const diff = angleBetween(from * DEG_TO_RAD, to * DEG_TO_RAD) * RAD_TO_DEG;
    test(from, to, diff, 'angle ');

    const clrFrom = color.hsl(from);
    const clrBetween = color.hsl(diff);

    canvas.rect([i, 64], [i + step / 2, 96], clrFrom);
    canvas.rect([i + step / 2, 64], [i + step, 96], clrBetween);
  }
};

draw();
