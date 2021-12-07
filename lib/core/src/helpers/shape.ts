import { Point, PointArg, Shape } from '../types';
import { point } from './point';
import { TWO_PI } from '../constants';

const rotate = function (
  shp: Shape,
  angle: number,
  pivot?: PointArg
): Shape {
  const pvt = point.get(pivot);
  const rotatedShape: Point[] = [];
  for (let i = 0; i < shp.length; i++) {
    rotatedShape.push(point.rotate(shp[i], angle, pvt));
  }
  return shp.map((dim) => point.rotate(dim, angle, pvt));
};

const scale = function (
  shp: Shape,
  scale: PointArg
): Shape {
  const scl = point.get(scale);
  const scaledShape: Point[] = [];
  for (let i = 0; i < shp.length; i++) {
    scaledShape.push(point.scale(shp[i], scl));
  }
  return scaledShape;
};

const translate = function (
  shp: Shape,
  offset: PointArg
): Shape {
  const off = point.get(offset);
  const translatedShape: Point[] = [];
  for (let i = 0; i < shp.length; i++) {
    translatedShape.push([
      shp[i][0] + off[0],
      shp[i][1] + off[1]
    ]);
  }
  return translatedShape;
};

class ShapeTransformer {
  constructor(public shape: Shape) {}
  rotate(
    angle: number,
    pivot?: PointArg
  ): ShapeTransformer {
    return new ShapeTransformer(
      rotate(this.shape, angle, pivot)
    );
  }
  scale(sc: PointArg): ShapeTransformer {
    return new ShapeTransformer(scale(this.shape, sc));
  }
  translate(offset: PointArg): ShapeTransformer {
    return new ShapeTransformer(
      translate(this.shape, offset)
    );
  }
}

const shape = function (shape: Shape) {
  return new ShapeTransformer(shape);
};

const makeShape = {
  rect(
    [x1, y1]: Point = [0, 0],
    [x2, y2]: Point = [0, 0],
    offsetHalf: boolean = true
  ): Shape {
    const offset = offsetHalf ? 0 : 0.5;
    return [
      [x1 + offset, y1 + offset],
      [x2 - offset, y1 + offset],
      [x2 - offset, y2 - offset],
      [x1 + offset, y2 - offset]
    ];
  },

  ngon(n: number = 3): Shape {
    const points: Point[] = [];
    const step = TWO_PI / n;
    for (let i = 0; i < n; i += 1) {
      points.push([Math.sin(i * step), Math.cos(i * step)]);
    }
    return points;
  }
};

const shapeBuilder = {
  ngon(n: number = 3): ShapeTransformer {
    return shape(makeShape.ngon(n));
  },
  rect(
    p1?: Point,
    p2?: Point,
    offsetHalf: boolean = true
  ): ShapeTransformer {
    return shape(makeShape.rect(p1, p2, offsetHalf));
  }
};

shape.make = makeShape;
shape.build = shapeBuilder;
shape.scale = scale;
shape.translate = translate;
shape.rotate = rotate;

export { shape, makeShape };

// TODO: Also an api shp(shp).scale().whatever()
