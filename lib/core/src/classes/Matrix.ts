import { Point } from '../types';

export type MatrixCreateIterator<Cell> = Cell | ((coords: Point) => Cell);
export type MatrixForEachIterator<Cell> = (cell: Cell, pos: Point, data: MatrixData<Cell>, dataSize: Point) => void;
export type MatrixMapIterator<Cell> = (cell: Cell, pos: Point, data: MatrixData<Cell>, dataSize: Point) => Cell;
export type MatrixData<Cell> = Cell[][];

export class Matrix<Cell = number> {
  data: MatrixData<Cell> = [];
  size: Point = [0, 0];

  create([xs, ys]: Point, filler: MatrixCreateIterator<Cell>) {
    const newData: MatrixData<Cell> = [];
    this.size = [xs, ys];
    for (let y = 0; y < ys; y++) {
      const newRow = [];
      for (let x = 0; x < xs; x++) {
        //@ts-expect-error wtf, typescript...
        newRow.push(typeof filler === 'function' ? filler([x, y]) : filler);
      }
      newData.push(newRow);
    }
    this.data = newData;
    return this;
  }

  forEach(iterator: MatrixForEachIterator<Cell>) {
    for (let y = 0; y < this.data.length; y++) {
      const row = this.data[y];
      for (let x = 0; x < row.length; x++) {
        iterator(row[x], [x, y], this.data, this.size);
      }
    }
  }
  map(iterator: MatrixMapIterator<Cell> | Cell) {
    const newData: MatrixData<Cell> = [];
    for (let y = 0; y < this.data.length; y++) {
      const oldRow = this.data[y];
      const newRow: Cell[] = [];
      for (let x = 0; x < oldRow.length; x++) {
        //@ts-expect-error wtf, typescript (TODO: fix iterator)
        newRow.push(typeof iterator === 'function' ? iterator(oldRow[x], [x, y], this.data, this.size) : iterator);
      }
      newData.push(newRow);
    }
    this.data = newData;
  }

  public get(coords: Point): Cell | undefined {
    const row = this.data[coords[1]];
    return row ? row[coords[0]] : undefined;
  }

  static create<Cell>(size: Point, filler: MatrixCreateIterator<Cell>): Matrix<Cell> {
    const m = new Matrix<Cell>();
    m.create(size, filler);
    return m;
  }
}
