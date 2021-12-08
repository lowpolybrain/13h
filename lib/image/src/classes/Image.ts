import { makeListener, Canvas, Point, PointArg, point } from '@13h/core';

export type ImageOptions = {
  crossOrigin: boolean;
};

export class Image {
  private _isReady: boolean = false;
  public element: HTMLImageElement;

  private _size: Point = [0, 0];
  private _center: Point = [0, 0];
  private _pivot: Point = [0, 0];

  public get pivot(): Point {
    return this._pivot;
  }

  public get size(): Point {
    return this._size;
  }

  public get height(): number {
    return this._size[1];
  }
  public get width(): number {
    return this._size[0];
  }
  public get cx(): number {
    return this._size[0] / 2;
  }
  public get cy(): number {
    return this._size[1] / 2;
  }
  public get center(): Point {
    return this._center;
  }

  public setSize([width, height]: Point): this {
    this._size = [width, height];
    this._center = [width / 2, height / 2];
    this.element.width = width;
    this.element.height = height;
    return this;
  }

  get isReady(): boolean {
    return this._isReady;
  }
  onLoad = makeListener<[Image]>(true, true);
  onError = makeListener<[ErrorEvent]>(true, true);

  constructor(private url: string, options: Partial<ImageOptions> = {}) {
    this.element = document.createElement('img');
    this.element.src = url;
    if (options.crossOrigin || options.crossOrigin === undefined) {
      this.element.crossOrigin = 'Anonymous';
    }
    this.element.addEventListener('load', () => {
      this._isReady = true;
      const { width, height } = this.element;
      this._size = [width, height];
      this._center = [width / 2, height / 2];
      this.onLoad.fire(this);
    });
    this.element.addEventListener('error', (e) => this.onError.fire(e));
  }

  draw(destination: Canvas, [x, y]: Point = [0, 0], rotation?: number, scale: PointArg = 1, alpha: number = 1) {
    const scl = point.get(scale);
    // TODO: Take smoothing into account
    destination.context.save();
    const [px, py] = this.pivot;
    destination.context.globalAlpha = alpha;
    if (!rotation && !scl && !rotation) {
      destination.context.drawImage(this.element, x - px, y - py);
    } else {
      if (x || y) {
        destination.context.translate(x, y);
      }
      if (rotation) {
        destination.context.rotate(rotation);
      }
      if (scl) {
        destination.context.scale(scl[0], scl[1]);
      }
      destination.context.translate(-px, -py);
      destination.context.drawImage(this.element, 0, 0);
      // destination.context.setTransform(1, 0, 0, 1, 0, 0); // TODO: Is this needed?
      // TODO: Maybe, use setTransform for translate/rotate/scl
    }
    destination.context.restore();
    return this;
  }

  createCanvas(cropStart?: PointArg, cropEnd?: PointArg): Canvas {
    const [sx, sy] = point.get(cropStart);
    const [ex, ey] = point.get(cropEnd, this.size);
    const canvas = new Canvas([ex - sx, ey - sy]);
    canvas.context.drawImage(this.element, -sx, -sy); // TODO: Benchmark fastest way of doing this
    return canvas;
  }
}
