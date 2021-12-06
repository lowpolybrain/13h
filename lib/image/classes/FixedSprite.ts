import { point, Point, Canvas, PointArg } from '@13h/core';
import { Image } from './Image';

export class FixedSprite {
  private size: Point;
  private _sprite: Canvas;
  private spriteIndex: number = 0;

  constructor(private image: Image | Canvas, size: PointArg, private spriteNum?: Point) {
    this.size = point.get(size);
    this._sprite = new Canvas(size);
    this.setSpriteIndex(0);
  }

  public setSpriteIndex(index: number): this {
    this.spriteIndex = index;
    this._sprite.clear();

    const [nx, ny] = this.getSpriteNum();
    const max = nx * ny;
    if (index < max && index >= 0) {
      const [xs, ys] = this.size;
      const xi = index % nx;
      const yi = Math.floor(index / nx);
      this._sprite.context.drawImage(this.image.element, -xi * xs, -yi * ys);
    }
    return this;
  }

  public get lastFrameIndex(): number {
    const [nx, ny] = this.getSpriteNum();
    return nx * ny - 1;
  }

  public nextSprite(): this {
    const nextSpriteIndex = (this.spriteIndex + 1) % this.lastFrameIndex;
    this.setSpriteIndex(nextSpriteIndex);
    return this;
  }

  public draw(destination: Canvas, pos?: Point, rotation?: number, scale?: PointArg, alpha?: number): this {
    this._sprite.draw(destination, pos, rotation, scale, alpha);
    return this;
  }

  private getSpriteNum(): Point {
    if (this.spriteNum) {
      return this.spriteNum;
    }
    const [w, h] = this.image.size;

    return [Math.floor(w / this.size[0]), Math.floor(h / this.size[1])];
  }

  public getDebugCanvas(): Canvas {
    const debugCanvas = this.image instanceof Canvas ? this.image.copy() : this.image.createCanvas();

    const [sx, sy] = this.size;

    const [nx, ny] = this.getSpriteNum();
    const w = sx * nx;
    const h = sy * ny;

    for (let ix = 0; ix <= nx; ix += 1) {
      const x = ix * sx;
      debugCanvas.line([x - 0.5, 0], [x - 0.5, h], '#0f05', 1);
      debugCanvas.line([x + 0.5, 0], [x + 0.5, h], '#f005', 1);
    }
    for (let iy = 0; iy <= ny; iy += 1) {
      const y = iy * sy;
      debugCanvas.line([0, y - 0.5], [w, y + 0.5], '#ff05', 1);
      debugCanvas.line([0, y + 0.5], [w, y + 0.5], '#00f5', 1);
    }

    debugCanvas.text(nx + 'x' + ny, [3, 3], '#000');
    debugCanvas.text(nx + 'x' + ny, [2.5, 2.5], '#fff');

    return debugCanvas;
  }
}
