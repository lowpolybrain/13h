import { Point } from './point';

export enum Corner {
  TopLeft = 'topLeft',
  TopRight = 'topRight',
  BottomRight = 'bottomRight',
  BottomLeft = 'bottomLeft'
}

export enum BoxPoint {
  Center = 'center',
  TopLeft = 'topLeft',
  TopRight = 'topRight',
  BottomRight = 'bottomRight',
  BottomLeft = 'bottomLeft'
}

export type Corners = Record<Corner, Point>;
export type Box = Record<BoxPoint, Point>;
