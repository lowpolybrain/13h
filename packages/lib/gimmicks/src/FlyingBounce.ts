import { point, Point, PointArg, TWO_PI } from '@13h/core';

export class FlyingBounce<Payload = never> {
  public position: [number, number];
  public speed: [number, number];
  public size: Point;
  public borderSize: Point;
  public payload?: Payload;
  public step: number = 0;

  constructor(speed?: PointArg, size: PointArg = 0.01, borderSize: PointArg = 1, startPos?: PointArg) {
    this.speed = point.get(speed, FlyingBounce.randomDirection(Math.random() * 0.01 + 0.01)) as [number, number];
    this.size = point.get(size);
    this.borderSize = point.get(borderSize);
    this.position = point.get(startPos, point.mul(this.borderSize, 0.5)) as [number, number];
  }

  public setPayload(pl: Payload): this {
    this.payload = pl;
    return this;
  }

  private hitTest(nextPos: Point): [1 | -1, 1 | -1] | null {
    const [px, py] = nextPos;
    const [zx, zy] = this.size;
    const [bx, by] = this.borderSize;

    const hitTop = py < 0;
    const hitBottom = py + zy > by;
    const hitLeft = px < 0;
    const hitRight = px + zx > bx;

    if (hitTop || hitBottom || hitLeft || hitRight) {
      return [hitLeft || hitRight ? -1 : 1, hitTop || hitBottom ? -1 : 1];
    }

    return null;
  }

  public next(): void {
    const [px, py] = this.position;
    const [sx, sy] = this.speed;
    const nextPos: Point = [px + sx, py + sy];
    const bounce = this.hitTest(nextPos);
    if (bounce) {
      this.speed[0] = this.speed[0] * bounce[0];
      this.speed[1] = this.speed[1] * bounce[1];
    } else {
      this.position[0] = nextPos[0];
      this.position[1] = nextPos[1];
    }
    this.step += 1;
  }

  public rewind(steps: number): this {
    for (let i = 0; i < steps; i++) {
      this.next();
    }
    return this;
  }

  static randomDirection(speed: number): Point {
    return point.rotate([speed, 0], Math.random() * TWO_PI);
  }

  static speedDirection(speed: number, rotInRad: number): Point {
    return point.rotate([speed, 0], rotInRad);
  }
}
