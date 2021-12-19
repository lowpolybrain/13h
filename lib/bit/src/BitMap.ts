import { Canvas, point, Point, PointArg } from '@13h/core';
import { numberToBits } from './numberToBits';

export class BitMap {
  constructor(private bits: number[], public size: Point) {}
  public drawPixels(c: Canvas, pos?: PointArg, color: [number, number, number, number] = [255, 255, 255, 255]) {
    const [x, y] = point.get(pos);
    const target = c.context;
    const imgData = target.getImageData(x, y, this.size[0], this.size[1]);
    for (let i = 0; i < this.bits.length; i++) {
      if (this.bits[i]) {
        imgData.data[i * 4] = color[0];
        imgData.data[i * 4 + 1] = color[1];
        imgData.data[i * 4 + 2] = color[2];
        imgData.data[i * 4 + 3] = color[3];
      }
    }
    target.putImageData(imgData, x, y);
  }
  static fromNumber(num: number, size: Point): BitMap {
    const signs = size[0] * size[1];
    let bits = numberToBits(num);
    const head = new Array(signs - bits.length).fill(0);
    return new BitMap([...head, ...bits], size);
  }
}
