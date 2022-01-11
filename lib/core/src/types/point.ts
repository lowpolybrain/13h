// TODO: Use Readonly only where applicable (sizes et cetera). DX over Strictness here.
// Maybe.. rename to Tuple :/
export type Point = Readonly<[number, number]>;
export type Points = Readonly<Point[]>;
export type PointArg = Point | number | undefined | number[];
