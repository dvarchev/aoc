import { cl, Config } from "aoc-utils";

const t1 = {
  input: `0 3 6 9 12 15
1 3 6 10 15 21
10 13 16 21 30 45`,
  expected: 114,
};

function parseInput(rawInput: string): number[][] {
  return rawInput.lines().map(line => line.split(" ").map(n => +n));
}

function generateExtrapArrays(numbers: number[]) {
  const extrapArrays = [numbers];
  while (extrapArrays[0].some(n => n !== 0)) {
    const last = extrapArrays[0];
    const nextArray = last.reduce((acc: number[], n, i) => (i ? [...acc, n - last[i - 1]] : acc), []);
    extrapArrays.unshift(nextArray);
  }
  return extrapArrays;
}

function calculateNextNumber(numbers: number[], nextN: (currentNs: number[], previousN: number) => number): number {
  const extrapArrays = generateExtrapArrays(numbers);
  let nextNumber = 0;
  for (let i = 1; i < extrapArrays.length; i++) {
    nextNumber = nextN(extrapArrays[i], nextNumber);
  }
  return nextNumber;
}

export function solvePart1(rawInput: string, resolveNext = (nn: number[], n: number) => nn.last() + n) {
  const input = parseInput(rawInput);

  return input.map(arrN => calculateNextNumber(arrN, resolveNext)).sum();
}

const t2 = {
  ...t1,
  expected: 2,
};

export function solvePart2(rawInput: string) {
  return solvePart1(rawInput, (nn, n) => nn[0] - n);
}

export const tests = [[t1], [t2]];
export const config: Config = {
  onlyTests: false,
};
