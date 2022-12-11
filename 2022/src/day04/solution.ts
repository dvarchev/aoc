import _ from "lodash";
import { cl } from "../utils/index.js";

const t1 = {
  input: `2-4,6-8
2-3,4-5
5-7,7-9
2-8,3-7
6-6,4-6
2-6,4-8`,
  expected: 2,
};

type pair = [number, number];
type linePairs = [pair, pair];

function parseInput(rawInput: string): linePairs[] {
  return rawInput
    .split("\n")
    .map(l => l.split(/[,\-]/).map(s => +s))
    .map(([n1, n2, n3, n4]) => [
      [n1, n2],
      [n3, n4],
    ]);
}
const isAround = (a: pair, b: pair) => a[0] <= b[0] && b[1] <= a[1];
const overlaps = (a: pair, b: pair) => a[0] <= b[1] && b[0] <= a[1];

export function solvePart1(rawInput: string) {
  const input = parseInput(rawInput);
  const contained = input.filter(([d1, d2]) => isAround(d1, d2) || isAround(d2, d1));
  return contained.length;
}

const t2 = {
  ...t1,
  expected: 4,
};

export function solvePart2(rawInput: string) {
  const input = parseInput(rawInput);
  const contained = input.filter(([d1, d2]) => overlaps(d1, d2));

  return contained.length;
}

export const tests = [[t1], [t2]];
export const onlyTests = false;
