import { Canvas, point, Point, PointArg } from '@13h/core';
import { coordsToLocal } from '@13h/controls';

class Field {
  private fieldCanvas: Canvas;
  public cellSize = 15;
  private field: number[][] = [];

  public getSize() {
    return this.size;
  }

  constructor(private size: [number, number]) {
    this.fieldCanvas = new Canvas(this.getCanvasSize());
  }

  private getCanvasSize(): Point {
    return [this.size[0] * this.cellSize, this.size[1] * this.cellSize];
  }

  private drawEmptyCell([x, y]: Point) {
    this.fieldCanvas.rect(
      [x * this.cellSize, y * this.cellSize],
      [x * this.cellSize + this.cellSize, y * this.cellSize + this.cellSize],
      '#fff'
    );
  }

  public setSize() {}

  public addRow() {
    this.size[0] += 1;
  }
  public addCol() {
    this.size[1] += 1;
  }
  public removeRow() {
    this.size[0] -= 1;
  }
  public removeCol() {
    this.size[1] -= 1;
  }

  public shiftUp() {}
  public shiftDown() {}
  public shiftRight() {}
  public shiftLeft() {}

  private drawFilledCell([x, y]: Point) {
    const xs = this.cellSize;
    const ys = this.cellSize;
    this.fieldCanvas.rect([x * xs, y * ys], [x * xs + xs, y * ys + ys], '#000');
  }

  render(c: Canvas, pos?: PointArg) {
    const size = this.getCanvasSize();

    //if (!point.eq(this.fieldCanvas.size, size)) {
    this.fieldCanvas.setSize(size);
    //}

    for (let x = 0; x < this.size[0]; x++) {
      for (let y = 0; y < this.size[1]; y++) {
        const cell = this.field[y] ? this.field[y][x] : 0;
        if (cell) {
          this.drawFilledCell([x, y]);
        } else {
          this.drawEmptyCell([x, y]);
        }
      }
    }

    const [x, y] = point.get(pos);
    this.fieldCanvas.draw(c, [x, y]);
  }
}

enum Click {
  Start,
  Hold,
  Release,
}

class Button {
  size: Point = [15, 15];
  constructor(public position: Point, private text: string, private onClick: () => void) {}
  render(canvas: Canvas) {
    canvas.rect(this.position, point.add(this.position, this.size), '#ccc');
    canvas.text.center(this.text, point.addHalf(this.position, this.size), '#000');
  }
  public checkClick(clickPos: Point, mode: Click) {
    if (point.insideRegion(clickPos, this.position, point.add(this.position, this.size))) {
      this.onClick();
    }
  }
}

class UI {
  buttons: Button[] = [];
  private fieldPos = [25, 25];
  public canvas: Canvas;
  constructor(private field: Field) {
    this.canvas = new Canvas([513, 257], document.body).crisp();
    this.canvas.element.style.scale = '2';
    this.canvas.element.addEventListener('click', this.handleClick);
    this.updateButtons();
  }

  updateButtons() {
    this.buttons = [
      new Button(point.add(this.fieldPos, [-20, 0]), '-', () => {
        this.field.removeCol();
        this.render();
      }),
      new Button(point.add(this.fieldPos, [-20, 20]), '+', () => {
        this.field.addCol();
        this.render();
      }),
      new Button(point.add(this.fieldPos, [-20, 40]), '↑', () => {
        this.field.shiftUp();
        this.render();
      }),
      new Button(point.add(this.fieldPos, [-20, 60]), '↓', () => {
        this.field.shiftDown();
        this.render();
      }),

      new Button(point.add(this.fieldPos, [0, -20]), '-', () => {
        this.field.removeRow();
        this.render();
      }),
      new Button(point.add(this.fieldPos, [20, -20]), '+', () => {
        this.field.addRow();
        this.render();
      }),
      new Button(point.add(this.fieldPos, [40, -20]), '←', () => {
        this.field.shiftLeft();
        this.render();
      }),
      new Button(point.add(this.fieldPos, [60, -20]), '→', () => {
        this.field.shiftRight();
        this.render();
      }),
    ];
  }

  render() {
    this.canvas.fill('#aaa');
    this.field.render(this.canvas, this.fieldPos);
    this.buttons.forEach((button) => button.render(this.canvas));
  }

  private handleClick = (e: MouseEvent) => {
    const localCoords = coordsToLocal(this.canvas, [e.offsetX, e.offsetY]);
    this.buttons.forEach((button) => button.checkClick(localCoords, Click.Release));
  };
}

const field = new Field([4, 5]);
const ui = new UI(field);
ui.render();
