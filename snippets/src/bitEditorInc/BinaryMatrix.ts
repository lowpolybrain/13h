import { Point, point, PointArg, EventListener, makeListener } from '@13h/core';

const maxLength = Number.MAX_SAFE_INTEGER.toString(2).length;

export class BinaryMatrix {
  private _value: boolean[][] = [];
  private _size: Point = [1, 1];

  constructor(size: PointArg = 1) {
    this._size = point.get(size);
    this.updateFieldToCorrespondToSize();
  }

  public get size(): Point {
    return this._size || [1, 1];
  }

  public get value(): Readonly<boolean[][]> {
    return this._value;
  }

  public set value(newValue: Readonly<boolean[][]>) {
    this._value = newValue as boolean[][];
  }

  private lastUpdatedSize: Point = [0, 0];

  private updateFieldToCorrespondToSize() {
    if (point.eq(this._size, this.lastUpdatedSize)) {
      return;
    }
    const [x, y] = this._size;
    const newValue: boolean[][] = [];
    for (let iy = 0; iy < y; iy++) {
      const newRow = newValue[iy] || [];
      const originalRow = this._value[iy] || [];
      for (let ix = 0; ix < x; ix++) {
        newRow[ix] = Boolean(this._value[iy] ? originalRow[ix] : false);
      }
      newValue[iy] = newRow;
    }
    this._value = newValue;
  }

  public set size(newSize: Point) {
    if (newSize[0] < 1 || newSize[1] < 1 || newSize[0] * newSize[1] > maxLength) {
      return;
    }
    this._size = newSize;
    this.updateFieldToCorrespondToSize();
  }

  public shiftUp() {
    this._value = [...this._value.slice(1), this._value[0]] as boolean[][];
  }
  public shiftDown() {
    this._value = [this._value[this._value.length - 1], ...this._value.slice(0, -1)] as boolean[][];
  }
  public shiftRight() {
    this._value = this._value.map((row) => [row[row.length - 1], ...row.slice(0, -1)] as boolean[]);
  }
  public shiftLeft() {
    this._value = this._value.map((row) => [...row.slice(1), row[0]] as boolean[]);
  }

  // TODO: Lower level SET (for mass operations)
  public set([x, y]: Point, newValue?: boolean) {
    const row = this.value[y];
    if (row) {
      const oldValue = row[x];
      const nextValue = newValue === undefined ? !oldValue : newValue;
      row[x] = nextValue;
      if (oldValue !== nextValue) {
        this.onChange.fire(this);
      }
    }
  }

  public get([x, y]: Point): boolean {
    const row = this.value[y]!;
    if (row) {
      return Boolean(row[x]);
    }
    return false;
  }

  public forEach(cb: (value: boolean, pos: Point) => void) {
    for (let y = 0; y < this.size[1]; y++) {
      for (let x = 0; x < this.size[0]; x++) {
        cb(this.get([x, y]), [x, y]);
      }
    }
  }

  public valueToBits = (): string => {
    let bits = '';
    this.forEach((v) => (bits += v ? '1' : '0'));
    return bits;
  };

  public setValueFromBits = (bits: string): void => {
    this.forEach((_, pos) => {
      const bitIndex = pos[1] * this.size[0] + pos[0];
      this.set(pos, bits[bitIndex] === '1');
    });
  };

  public fill = (): void => this.forEach((v, pos) => this.set(pos, true));
  public clear = (): void => this.forEach((v, pos) => this.set(pos, false));
  public invert = (): void => this.forEach((v, pos) => this.set(pos, !v));

  public onChange = makeListener<[BinaryMatrix]>();
}
