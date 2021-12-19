import { BitMap } from '@13h/bit';
import { animate, makeCanvas } from '../common';
import { Canvas, random } from '@13h/core';

const glyphs = [
  437645398712547, 152049472185506, 287048812925249, 275206991144126, 123443206243356, 559748933669247, 287753031605057,
  66285781460088, 333495845000681, 273861653774463, 188394711823786, 152465476070050, 534557137602145, 321685687669321,
  38112644768924, 1875158534664, 532349808126031,
];
const numbers = [442326, 158242, 923279, 923166, 150001, 1019678, 495510, 987716, 431775, 1021726];
const bitmaps = glyphs.map((number) => BitMap.fromNumber(number, [7, 7]));

const canvas = makeCanvas(512, false).crisp();
canvas.fill('#fff');

const scale = 2;
const bitCanvas = new Canvas(128).crisp();
const scaledCanvas = new Canvas(bitCanvas.width * scale).crisp();

const padding = 1;
const [sx, sy] = bitmaps[0].size;

animate((n) => {
  if (!(n % 10 === 0)) return;
  bitCanvas.clear();
  for (let x = padding; x <= bitCanvas.width; x += sx + padding) {
    for (let y = padding; y <= bitCanvas.height; y += sy + padding) {
      let i = random.iRange(0, bitmaps.length - 1);
      bitmaps[i].drawPixels(bitCanvas, [x, y], [0, 0, 0, 255]);
    }
  }
  scaledCanvas.clear();
  bitCanvas.draw(scaledCanvas, undefined, 0, scale, 0.05);
  const pattern = canvas.createPattern(scaledCanvas);
  canvas.fill('#eee');
  if (pattern) {
    canvas.fill(pattern as CanvasPattern);
  }
});