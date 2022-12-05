import run from "aocrunner";
import _ from "lodash";
import { cl } from "../utils/index.js"

const t1 =  {
    input: ``,
    expected: "",
};

function parseInput(rawInput: string) {
  return rawInput;
}

function solvePart1(rawInput: string) {
  const input = parseInput(rawInput);

  return;
};

const t2 =  {
  ...t1,
  expected: "",
};

function solvePart2(rawInput: string) {
  const input = parseInput(rawInput);

  return;
};

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
