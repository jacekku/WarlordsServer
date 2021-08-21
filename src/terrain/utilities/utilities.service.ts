export class Utilities {
  static getXY(index: number, columns: number): { x: number; y: number } {
    return {
      x: index % columns,
      y: Math.floor(index / columns),
    };
  }

  static clampNumber(num: number, min: number, max: number): number {
    return Math.min(Math.max(num, min), max);
  }

  static map(
    n: number,
    start1: number,
    stop1: number,
    start2: number,
    stop2: number,
  ): number {
    return ((n - start1) / (stop1 - start1)) * (stop2 - start2) + start2;
  }
}
