export class Point {
  constructor(public x: number, public y: number) {}
  static fromArray([x, y]: number[]) {
    return new Point(x, y);
  }
  add(toAdd: [number, number] | Point): Point {
    if (Array.isArray(toAdd)) {
      return new Point(this.x + toAdd[0], this.y + toAdd[1]);
    }
    return new Point(this.x + toAdd.x, this.y + toAdd.y);
  }
  equals(other: Point): boolean {
    return this.x === other.x && this.y === other.y;
  }
  toString(): string {
    return `${this.x},${this.y}`;
  }
}
