import { Canvas, point } from '@13h/core';
import { coordsToLocal } from '@13h/controls';
import { createElement } from '@13h/dom';

import { BinaryMatrix, BinaryMatrixEditor, Click, UiButton } from './bitEditorInc';

class UI {
  buttons: UiButton[] = [];
  private fieldPos = [25, 25];
  public canvas: Canvas;

  constructor(private matrixEditor: BinaryMatrixEditor) {
    this.canvas = new Canvas([128, 128], document.body).crisp();

    this.canvas.element.style.transformOrigin = '0 0';
    //this.canvas.element.style.transform = 'scale(2)';

    this.canvas.element.addEventListener('mousedown', this.handleMouseDown);
    this.canvas.element.addEventListener('mousemove', this.handleMouseMove);
    this.canvas.element.addEventListener('mouseup', this.handleMouseUp);
    this.updateButtons();
  }

  mouseIsClicked: boolean = false;

  handleMouseDown = (e: MouseEvent) => {
    this.mouseIsClicked = true;
    this.handleMouseEvent(e, Click.Start);
  };

  handleMouseMove = (e: MouseEvent) => {
    if (this.mouseIsClicked) {
      this.handleMouseEvent(e, Click.Hold);
    }
  };

  handleMouseUp = (e: MouseEvent) => {
    if (this.mouseIsClicked) {
      this.handleMouseEvent(e, Click.Release);
      this.mouseIsClicked = false;
    }
  };

  updateButtons() {
    this.buttons = [
      new UiButton(point.add(this.fieldPos, [-20, 0]), '-', () => {
        this.matrixEditor.matrix.size = point.add(this.matrixEditor.matrix.size, [0, -1]);
        this.render();
      }),
      new UiButton(point.add(this.fieldPos, [-20, 20]), '+', () => {
        this.matrixEditor.matrix.size = point.add(this.matrixEditor.matrix.size, [0, 1]);
        this.render();
      }),
      new UiButton(point.add(this.fieldPos, [-20, 40]), '↑', () => {
        this.matrixEditor.matrix.shiftUp();
        this.render();
      }),
      new UiButton(point.add(this.fieldPos, [-20, 60]), '↓', () => {
        this.matrixEditor.matrix.shiftDown();
        this.render();
      }),

      new UiButton(point.add(this.fieldPos, [0, -20]), '-', () => {
        this.matrixEditor.matrix.size = point.add(this.matrixEditor.matrix.size, [-1, 0]);
        this.render();
      }),
      new UiButton(point.add(this.fieldPos, [20, -20]), '+', () => {
        this.matrixEditor.matrix.size = point.add(this.matrixEditor.matrix.size, [1, 0]);
        this.render();
      }),
      new UiButton(point.add(this.fieldPos, [40, -20]), '←', () => {
        this.matrixEditor.matrix.shiftLeft();
        this.render();
      }),
      new UiButton(point.add(this.fieldPos, [60, -20]), '→', () => {
        this.matrixEditor.matrix.shiftRight();
        this.render();
      }),
      new UiButton(point.add(this.fieldPos, [-20, -20]), '▣', () => {
        this.matrixEditor.matrix.invert();
        this.render();
      }),
      new UiButton(point.add(this.fieldPos, [-20, 80]), '×', () => {
        this.matrixEditor.matrix.clear();
        this.render();
      }),
    ];
  }

  render() {
    this.canvas.fill('#aaa');
    this.matrixEditor.draw(this.canvas, this.fieldPos);
    this.buttons.forEach((button) => button.render(this.canvas));
  }

  private handleMouseEvent = (e: MouseEvent, click: Click) => {
    const localCoords = coordsToLocal(this.canvas, [e.offsetX, e.offsetY]);
    if (point.insideRegion(localCoords, this.fieldPos, point.add(this.fieldPos, this.matrixEditor.canvasSize))) {
      const fieldLocalCoords = point.sub(localCoords, this.fieldPos);
      this.matrixEditor.handleClick(fieldLocalCoords, click);
      this.render();
    } else {
      this.buttons.forEach((button) => button.checkClick(localCoords, click));
    }
  };
}

const matrix = new BinaryMatrix([7, 7]);
matrix.setValueFromBits((437645398712547).toString(2));
const editor = new BinaryMatrixEditor(matrix);
const ui = new UI(editor);
ui.canvas.element.style.width = ui.canvas.width * 2 + 'px';
ui.canvas.element.style.height = ui.canvas.height * 2 + 'px';


const input = createElement('input').addTo(createElement('div').addTo(document.body));

const renderCurrentState = (mat: BinaryMatrix) => (input.value = '' + parseInt(mat.valueToBits(), 2));
matrix.onChange(renderCurrentState);
renderCurrentState(matrix);
// input.addEventListener('keydown', () => {
//   matrix.setValueFromBits((parseInt(input.value, 10) || 0).toString(2));
// });

ui.render();
