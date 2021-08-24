export class Quad {
  constructor(
    public x: number,
    public y: number,
    public width: number,
    public height: number,
  ) {
    this.x = Number(x);
    this.y = Number(y);
    this.width = Number(width);
    this.height = Number(height);
  }

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

  static quadsOverlapping(quad1: Quad, quad2: Quad) {
    return (
      this.pointInQuad(quad1, quad2.x, quad2.y) ||
      this.pointInQuad(quad1, quad2.x + quad2.width, quad2.y + quad2.height) ||
      this.pointInQuad(quad1, quad2.x + quad2.width, quad2.y) ||
      this.pointInQuad(quad1, quad2.x, quad2.y + quad2.height) ||
      this.pointInQuad(quad2, quad1.x, quad1.y) ||
      this.pointInQuad(quad2, quad1.x + quad1.width, quad1.y + quad1.height) ||
      this.pointInQuad(quad2, quad1.x + quad1.width, quad1.y) ||
      this.pointInQuad(quad2, quad1.x, quad1.y + quad1.height)
    );
  }
}
