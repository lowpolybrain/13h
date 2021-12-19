import { Canvas, point, Point, PointArg } from '@13h/core';
import { BinaryMatrix } from './BinaryMatrix';
import { Click } from './Click';

export class BinaryMatrixEditor {
  private canvas: Canvas;
  public cellSize = 10;

  constructor(public readonly matrix: BinaryMatrix) {
    this.canvas = new Canvas(this.canvasSize);
  }

  public get canvasSize(): Point {
    return [this.matrix.size[0] * this.cellSize, this.matrix.size[1] * this.cellSize];
  }

  private drawEmptyCell([x, y]: Point) {
    this.canvas.rect(
      [x * this.cellSize, y * this.cellSize],
      [x * this.cellSize + this.cellSize, y * this.cellSize + this.cellSize],
      '#fff'
    );
  }

  private drawFilledCell([x, y]: Point) {
    const xs = this.cellSize;
    const ys = this.cellSize;
    this.canvas.rect([x * xs, y * ys], [x * xs + xs, y * ys + ys], '#000');
  }

  public draw(c: Canvas, pos?: PointArg) {
    const size = this.canvasSize;
    this.canvas.setSize(size);
    this.matrix.forEach((checked, pos) => {
      if (checked) {
        this.drawFilledCell(pos);
      } else {
        this.drawEmptyCell(pos);
      }
    });

    const [x, y] = point.get(pos);
    this.canvas.draw(c, [x, y]);
  }

  drawingMode: boolean = false;
  public handleClick(pos: Point, click: Click) {
    const fieldCellCoords = point.floor(point.div(pos, this.cellSize));
    if (click === Click.Start) {
      this.drawingMode = !this.matrix.get(fieldCellCoords);
    }
    this.matrix.set(fieldCellCoords, this.drawingMode);
  }
}
