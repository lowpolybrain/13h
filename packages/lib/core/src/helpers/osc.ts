export const osc = {
  sin: function (t: number, max: number): number {
    return (Math.sin(t) * max) / 2 + max / 2;
  },
  cos: function (t: number, max: number): number {
    return (Math.cos(t) * max) / 2 + max / 2;
  }
};
