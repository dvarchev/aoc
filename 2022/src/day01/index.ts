import run from "aocrunner";
import _ from "lodash";
import { cl } from "../utils/index.js"

const t1 =  {
  input: `1000
2000
3000

4000

5000
6000

7000
8000
9000

10000`,
  expected: 24000,
};

function parseInput(rawInput: string) {
  return rawInput
    .split("\n\n")
    .map((e) => e.split("\n"))
    .map((el) => el.map((x) => +x));
}

function getSums(rawInput: string): number[] {
  const elves = parseInput(rawInput);
  const sums = elves
    .map((e) => _.sum(e))
    .sort((a, b) => b - a);
  return sums;
}

function solvePart1(rawInput: string) {
  const sums = getSums(rawInput);
  return sums[0];
}
const t2 = {
  ...t1,
  expected: 45000,
};

function solvePart2(rawInput: string) {
  const sums = getSums(rawInput);
  return sums[0] + sums[1] + sums[2];
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
