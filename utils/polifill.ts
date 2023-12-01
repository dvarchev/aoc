export function polifill() {
  if (!Array.times) {
    Array.times = function <T>(count: number, getValue?: (index: number) => T): T[] {
      const result = new Array(count);
      for (let i = 0; i < count; i++) result[i] = getValue ? getValue(i) : i;
      return result;
    };
  }

  if (!Array.prototype.chunk) {
    Array.prototype.chunk = function <T>(chunkSize: number): T[][] {
      const result: T[][] = [];
      for (let i = 0; i < this.length; i += chunkSize) {
        const ch = this.slice(i, i + chunkSize);
        result.push(ch);
      }
      return result;
    };
  }

  if (!String.prototype.chunk) {
    String.prototype.chunk = function (chunkSize: number): string[] {
      const result: string[] = [];
      for (let i = 0; i < this.length; i += chunkSize) {
        const ch = this.slice(i, i + chunkSize);
        result.push(ch);
      }
      return result;
    };
  }

  if (!Array.prototype.toJson) {
    Array.prototype.toJson = function (): string {
      return JSON.stringify(this);
    };
  }
  if (!Array.prototype.last) {
    Array.prototype.last = function (): string {
      return this.at(-1);
    };
  }


  if (!Array.prototype.unique) {
    Array.prototype.unique = function<T>(): T[] {
      return this.filter((v, i, a) => a.indexOf(v) === i);
    };
  }
  if (!Array.prototype.min) {
    Array.prototype.min = function (): number {
      return Math.min.apply(null, this);
    };
  }
  if (!Array.prototype.max) {
    Array.prototype.max = function (): number {
      return Math.max.apply(null, this);
    };
  }

  if (!Array.prototype.sum) {
    Array.prototype.sum = function (): number {
      return this.reduce((a, b) => a + b, 0);
    };
  }
}
