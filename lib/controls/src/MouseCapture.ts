import { Canvas, Point, point } from '@13h/core';
import { coordsToLocal } from './coordsToLocal';

export enum LockState {
  Unlocked,
  Pending,
  Locked,
}

export class MouseCapture {
  constructor(c?: Canvas) {
    if (c) {
      this.mount(c);
    }
  }

  public get isMounted(): boolean {
    return !!this.mountedCanvas;
  }

  public setPos(newPos: Point) {
    this.pos = point.clamp(newPos, point.zero, [Infinity, Infinity]);
    this.unClampedPos = newPos;
  }

  /** Position in canvas coordinates */
  public unClampedPos: Point = [0, 0];
  public pos: Point = [0, 0];

  public mount(c: Canvas) {
    this.unmount();
    this.mountedCanvas = c;
    this.pos = point.clamp(this.pos, point.zero, c.maxPoint);
    c.element.addEventListener('click', this.handleClick);
    c.element.addEventListener('pointerup', this.handleUnlock);
    document.addEventListener('pointerlockchange', this.handlePointerLockChange);
    document.addEventListener('pointerlockerror', this.handleUnlock);
  }

  public unmount() {
    if (this.mountedCanvas) {
      this.mountedCanvas.element.removeEventListener('click', this.handleClick);
      this.mountedCanvas.element.removeEventListener('pointerup', this.handleUnlock);
      document.removeEventListener('pointerlockchange', this.handlePointerLockChange);
      document.removeEventListener('pointerlockerror', this.handleUnlock);
      this.mountedCanvas.element.removeEventListener('mousemove', this.handleMouseMove);
    }
    this.mountedCanvas = undefined;
  }

  public lockState = LockState.Unlocked;

  /// ---

  private handlePointerLockChange = () => {
    if (this.lockState === LockState.Pending) {
      this.lockState = LockState.Locked;
      this.mountedCanvas?.element.addEventListener('mousemove', this.handleMouseMove);
    } else {
      this.lockState = LockState.Unlocked;
      this.mountedCanvas?.element.removeEventListener('mousemove', this.handleMouseMove);
    }
  };

  private handleClick = async (e: MouseEvent) => {
    if (this.mountedCanvas && this.lockState === LockState.Unlocked) {
      this.lockState = LockState.Pending;
      try {
        await this.mountedCanvas.element.requestPointerLock();
      } catch (e) {
        this.lockState = LockState.Unlocked;
      }
    }
  };

  private handleUnlock = () => {
    this.lockState = LockState.Unlocked;
  };

  private handleMouseMove = (e: MouseEvent) => {
    if (this.lockState === LockState.Locked && this.mountedCanvas) {
      const realDelta: Point = [e.movementX, e.movementY];

      this.unClampedPos = point.add(this.pos, coordsToLocal(this.mountedCanvas, realDelta));

      this.pos = point.clamp(
        point.add(this.pos, coordsToLocal(this.mountedCanvas, realDelta)),
        point.zero,
        this.mountedCanvas.maxPoint
      );
    }
  };

  private mountedCanvas?: Canvas;
}
