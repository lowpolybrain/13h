// TODO: Make sure the class does not use its own getters

import { point } from '../helpers';

import { FillStyle, Corner, Corners, LineCap, StrokeStyle, Point, Shape, PointArg, Repeat } from '../types';

interface Text<P> {
  (text: string | number, pos?: Point, fill?: FillStyle): P;
  center: this;
}

export class Canvas {
  private strokeFill(fillStyle?: FillStyle, lineWidth?: number, strokeStyle?: StrokeStyle, closePath?: boolean) {
    if (closePath) this.context.closePath();
    if (lineWidth) this.context.lineWidth = lineWidth;
    if (fillStyle) this.context.fillStyle = fillStyle;
    if (strokeStyle) this.context.strokeStyle = strokeStyle;
    if (lineWidth || strokeStyle) this.context.stroke();
    if (fillStyle) this.context.fill();
  }

  public element: HTMLCanvasElement;
  public context: CanvasRenderingContext2D;
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

  public getCorners(offsetHalf: boolean = false): Corners {
    const offset = offsetHalf ? 0.5 : 1;
    return {
      [Corner.TopLeft]: [offset, offset],
      [Corner.TopRight]: [this.width - offset, offset],
      [Corner.BottomRight]: [this.width - offset, this.height - offset],
      [Corner.BottomLeft]: [offset, this.height - offset],
    };
  }

  public getContour(offsetHalf: boolean = false): Shape {
    return Object.values(this.getCorners(offsetHalf));
  }

  constructor(size?: PointArg, target?: HTMLElement) {
    const [width, height] = point.get(size);
    this.element = document.createElement('canvas');
    const context = this.element.getContext('2d');
    if (!context) {
      throw new Error('Could not retrieve canvas context. Are you on web?');
    }
    this.context = context;
    this.setSize([width, height]);

    if (target) {
      this.appendTo(target);
    }
  }

  public appendTo(target: HTMLElement): this {
    target.appendChild(this.element);
    return this;
  }

  public setSize([width, height]: Point): this {
    this._size = [width, height];
    this._center = [width / 2, height / 2];
    this.element.width = width;
    this.element.height = height;
    return this;
  }

  public setPivot([width, height]: Point): this {
    this._pivot = [width, height];
    return this;
  }

  public centerPivot(): this {
    return this.setPivot(this._center);
  }

  public rect([x1, y1]: Point, [x2, y2]: Point, fill?: FillStyle): this {
    this.setFillStyle(fill);
    if (x1 !== x2 && y1 !== y2) {
      const sx = x1 < x2 ? x2 - x1 : x1 - x2;
      const sy = y1 < y2 ? y2 - y1 : y1 - y2;
      const px = x1 < x2 ? x1 : x2;
      const py = y1 < y2 ? y1 : y2;
      this.context.fillRect(px, py, sx, sy);
    }
    return this;
  }

  public dot([x, y]: Point, color?: FillStyle, size: number = 1): this {
    if (color) {
      this.context.fillStyle = color;
    }
    const fl = Math.floor(size / 2);
    this.context.fillRect(x - fl, y - fl, size, size);
    return this;
  }

  public setFillStyle(fillStyle?: FillStyle): this {
    if (fillStyle) {
      this.context.fillStyle = fillStyle;
    }
    return this;
  }

  public fill(fillStyle: FillStyle): this {
    this.setFillStyle(fillStyle);
    this.context.fillRect(0, 0, this.width, this.height);
    return this;
  }

  public clear(): this {
    this.context.clearRect(0, 0, this.width, this.height);
    return this;
  }

  // TODO: Refactor maybe
  public crisp(): this {
    this.context.imageSmoothingEnabled = false;
    this.element.style.imageRendering = 'pixelated';
    return this;
  }

  // TODO: Rid of C0DEFF past :D
  public draw(
    destination: Canvas,
    [x, y]: Point = [0, 0],
    rotation?: number,
    scale: PointArg = 1,
    alpha: number = 1
  ): this {
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

  public line(a: PointArg, b: PointArg, color: FillStyle, width: number = 1): this {
    this.poly([point.get(a), point.get(b)], 'transparent', width, color, false);
    return this;
  }

  public createPattern(c: CanvasImageSource | Canvas, repetition: Repeat = Repeat.XY): CanvasPattern | null {
    let element: CanvasImageSource;
    if (c instanceof Canvas) {
      element = c.element;
    } else {
      element = c;
    }
    return this.context.createPattern(element, repetition);
  }

  public poly(
    shape: Shape,
    fillStyle?: FillStyle,
    lineWidth: number = 1,
    strokeColor?: FillStyle,
    closePath: boolean = true,
    lineCap: LineCap = LineCap.Butt
  ) {
    this.context.lineCap = lineCap;

    this.context.beginPath();
    this.context.moveTo(shape[0][0], shape[0][1]);

    for (var i = 1; i < shape.length; i++) {
      this.context.lineTo(shape[i][0], shape[i][1]);
    }

    this.strokeFill(fillStyle, lineWidth, strokeColor, closePath);

    return this;
  }

  public copy(cropStart?: PointArg, cropEnd?: PointArg): Canvas {
    const [sx, sy] = point.get(cropStart);
    const [ex, ey] = point.get(cropEnd, this.size);
    const clone = new Canvas([ex - sx, ey - sy]);
    clone.context.drawImage(this.element, -sx, -sy); // TODO: Benchmark fastest way of doing this
    return clone;
  }

  // TODO: Split this
  public get text(): Text<this> {
    const that: Canvas = this;
    let setTextAlign: CanvasRenderingContext2D['textAlign'] = 'start';
    let setBaseLine: CanvasRenderingContext2D['textBaseline'] = 'top';
    const textMaker = function (text: string | number, [x, y]: Point = [10, 10], fill?: FillStyle) {
      const oldTextAlign = that.context.textAlign;
      const oldTextBaseline = that.context.textBaseline;
      that.context.textAlign = setTextAlign;
      that.context.textBaseline = setBaseLine;
      that.setFillStyle(fill);
      that.context.fillText(`${text}`, x, y);
      that.context.textAlign = oldTextAlign;
      that.context.textBaseline = oldTextBaseline;
      return that;
    };

    Object.defineProperty(textMaker, 'center', {
      get: function () {
        setTextAlign = 'center';
        setBaseLine = 'middle';
        return textMaker;
      },
    });

    //@ts-expect-error TODO: Learn how to make defineProperty work TS way.
    return textMaker;
  }
}
