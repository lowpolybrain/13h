import { Point } from '@13h/core';

export class Trail {
  public a?: Point;
  public b?: Point;
  public nextPoint(point: Point) {
    this.b = this.a;
    this.a = point;
  }
  public get drawable(): boolean {
    return !!(this.a && this.b);
  }
}
