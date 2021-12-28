import { Canvas, Point } from '@13h/core';
import { coordsToLocal } from './coordsToLocal';

/** Tracking mouse position in canvas coordinates */
export class MouseTracker {
  constructor(c?: Canvas) {
    if (c) {
      this.mount(c);
    }
  }

  /** Real position (relative to upper left corner of the element) */
  public realPos: Point = [0, 0];
  /** Position in canvas coordinates */
  public pos: Point = [0, 0];

  public mount(c: Canvas) {
    this.unmount();
    this.mountedCanvas = c;
    c.element.addEventListener('mousemove', this.mouseMove);
  }

  public get isMounted(): boolean {
    return !!this.mountedCanvas;
  }

  public unmount() {
    if (this.mountedCanvas) {
      this.mountedCanvas.element.removeEventListener('mousemove', this.mouseMove);
      this.mountedCanvas = undefined;
    }
  }

  /// ---

  private mountedCanvas?: Canvas;

  private mouseMove = (e: MouseEvent) => {
    if (this.mountedCanvas) {
      this.realPos = [
        e.offsetX - this.mountedCanvas.element.offsetLeft,
        e.offsetY - this.mountedCanvas.element.offsetTop,
      ];
      this.pos = coordsToLocal(this.mountedCanvas, this.realPos);
    }
  };
}
