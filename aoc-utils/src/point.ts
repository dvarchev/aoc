/**
 * Represents a point in a 2D coordinate system.
 */
export class Point {
  /**
   * Creates a new Point instance.
   * @param x - The x-coordinate of the point.
   * @param y - The y-coordinate of the point.
   */
  constructor(public x: number, public y: number) {}

  /**
   * Creates a new Point instance from an array of numbers.
   * @param arr - The array containing the x and y coordinates.
   * @returns A new Point instance.
   */
  static fromArray(arr: number[]): Point {
    const [x, y] = arr;
    return new Point(x, y);
  }

  /**
   * Adds the given coordinates to the current point and returns a new Point instance.
   * @param toAdd - The coordinates to add. Can be an array of numbers or a Point instance.
   * @returns A new Point instance representing the result of the addition.
   */
  add(toAdd: [number, number] | Point): Point {
    if (Array.isArray(toAdd)) {
      const [x, y] = toAdd;
      return new Point(this.x + x, this.y + y);
    }
    return new Point(this.x + toAdd.x, this.y + toAdd.y);
  }

  /**
   * Checks if the current point is equal to the given point.
   * @param other - The point to compare with.
   * @returns True if the points are equal, false otherwise.
   */
  equals(other: Point): boolean {
    return this.x === other.x && this.y === other.y;
  }

  /**
   * Returns a string representation of the point in the format "x,y".
   * @returns The string representation of the point.
   */
  toString(): string {
    return `${this.x},${this.y}`;
  }
}
