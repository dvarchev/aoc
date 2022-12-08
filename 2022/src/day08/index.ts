import run from "aocrunner";
import _ from "lodash";
import { cl } from "../utils/index.js";

const t1 = {
  input: `30373
25512
65332
33549
35390`,
  expected: 21,
};

function parseInput(rawInput: string) {
  return rawInput.split("\n").map((l) => l.split("").map((n) => +n));
}

function solvePart1(rawInput: string) {
  const input = parseInput(rawInput);

  const vals = input.flatMap((l, i) =>
    l.map((n, j) => getVisibileFlag(i, j, input)),
  );

  return _.sum(vals);
}

const t2 = {
  ...t1,
  expected: 8,
};

function solvePart2(rawInput: string) {
  const input = parseInput(rawInput);
  const vals = input.flatMap((l, i) =>
    l.map((n, j) => getSceneticValue(i, j, input)),
  );
  return _.max(vals);
}

function getVisibileFlag(i: number, j: number, input: number[][]): number {
  const h = input[i][j];
  const { l, r, t, b } = getLTRBArrays(input, i, j);
  return _.every([l, r, t, b], (arr) => _.some(arr, (n) => n >= h)) ? 0 : 1;
}

function getLTRBArrays(input: number[][], i: number, j: number) {
  const row = input[i];
  const l = row.slice(0, j);
  const r = row.slice(j + 1, row.length);
  const col = input.map((l) => l[j]);
  const t = col.slice(0, i);
  const b = col.slice(i + 1, col.length);
  return { l, r, t, b };
}

function getSceneticValue(i: number, j: number, input: number[][]): number {
  const h = input[i][j];
  const { l: lr, r, t: tr, b } = getLTRBArrays(input, i, j);
  const l = lr.reverse();
  const t = tr.reverse();
  const vals = [l, t, r, b].map((a) => {
    const ind = a.findIndex((n) => n >= h);

    return ind < 0 ? a.length : ind + 1;
  });
  return vals.reduce((a, b) => a * b);
}

run({
  part1: {
    tests: [t1],
    solution: solvePart1,
  },
  part2: {
    tests: [t2],
    solution: solvePart2,
  },
  trimTestInputs: false,
  onlyTests: false,
});