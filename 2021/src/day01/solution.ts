import _ from "lodash";
import { cl } from "../utils/index.js";

const t1 = {
  input: `199
200
208
210
200
207
240
269
260
263`,
  expected: 7,
};

function parseInput(rawInput: string) {
  return rawInput.split("\n").map((l) => +l);
}

export function solvePart1(rawInput: string) {
  const input = parseInput(rawInput);

  return input.filter((_n, i) => i > 0 && input[i] > input[i - 1]).length;
}

const t2 = {
  ...t1,
  expected: 5,
};

export function solvePart2(rawInput: string) {
  const input = parseInput(rawInput);
  const nCount = input.length;
  const sums3 = input
    .map((_n, i) =>
      i < nCount - 2 ? input[i] + input[i + 1] + input[i + 2] : 0,
    )
    .slice(0, nCount - 2);
  return sums3.filter((_n, i) => i > 0 && sums3[i] > sums3[i - 1]).length;
}

export const tests = [[t1], [t2]];
export const onlyTests = false;
