import { Canvas, point, Point } from '@13h/core';
import { Click } from './Click';

export class UiButton {
  size: Point = [16, 16];
  constructor(public position: Point, private text: string, private onClick: () => void) {}
  render(canvas: Canvas) {
    canvas.rect(this.position, point.add(this.position, this.size), '#ccc');
    canvas.context.font = 'normal 14px monospace';
    canvas.text.center(this.text, point.addHalf(this.position, this.size), '#000');
  }
  public checkClick(clickPos: Point, mode: Click) {
    if (mode === Click.Release && point.insideRegion(clickPos, this.position, point.add(this.position, this.size))) {
      this.onClick();
    }
  }
}
