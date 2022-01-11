import { makeFrame } from './inc/boilerplate';
import { Canvas, clamp, point, Point, PointArg } from '@13h/core';
import { plotGraph, GraphF, mul, curry } from './inc/graph';

const getPlotNextGraph = (canvas: Canvas, size: PointArg = 256, margin: number = 5, numPoints?: number) => {
  const [sx, sy] = point.get(size);
  const pos = [sx / 2, sy / 2];
  const newLine = () => {
    pos[0] = sx / 2;
    pos[1] += sy + margin;
  };
  const plotNextGraph = (f: GraphF) => {
    if (pos[0] > canvas.width - sx / 2) {
      newLine();
    }
    plotGraph(canvas, f, pos as unknown as Point, size, numPoints || sx);
    pos[0] += sx + margin;
  };
  plotNextGraph.newLine = newLine;
  return plotNextGraph;
};


makeFrame((canvas) => {
  const plot = getPlotNextGraph(canvas, [256, 128], 5);

  const fade = (x: number) => -Math.cos(x * Math.PI) * 0.5 - 0.5;
  const sin4 = (x: number) => Math.sin(x * 4 * Math.PI);
  const cos4 = (x: number) => Math.cos(x * Math.PI);
  const tan = (x: number) => Math.tan(x * Math.PI);
  const clmp = (x: number) => clamp(x, -1, 1);
  const half = (x: number) => x * 0.5;

  plot(fade);
  plot(sin4);
  plot(mul(fade, sin4));
  plot.newLine();
  plot(curry(tan, clmp, half));
});
