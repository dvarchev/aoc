export {};

declare global {
  interface Array<T> {
    toJson(): string;
    last(): T | undefined;
    min(): number;
    max(): number;
    sum(): number;
    chunk(chunkSize: number): T[][];
    unique(): T[];
  }

  interface String {
    chunk(chunkSize: number): string[];
  }

  interface ArrayConstructor {
    times<TResult>(n: number, iteratee: (num: number) => TResult): TResult[];
    times(n: number): number[];
  }
  interface Object {
    forEach<T>(callbackfn: (value: T, key: string) => void): void;
  }
}
