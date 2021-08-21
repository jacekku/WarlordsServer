export class Quad {
  constructor(
    public x: number,
    public y: number,
    public width: number,
    public height: number,
  ) {}

  static pointInQuad(quad: Quad, pointX: number, pointY: number) {
    let { x, y, width, height } = quad;
    x = Number(x);
    y = Number(y);
    width = Number(width);
    height = Number(height);
    return (
      pointX >= x && pointY >= y && pointX < x + width && pointY < y + height
    );
  }
}
