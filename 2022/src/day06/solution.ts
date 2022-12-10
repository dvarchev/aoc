import _ from "lodash";
import { cl } from "../utils/index.js";

const t1 = {
  input: `mjqjpqmgbljsphdztnvjfqwrcgsmlb`,
  expected: 7,
};
const t12 = {
  input: `bvwbjplbgvbhsrlpgdmjqwftvncz`,
  expected: 5,
};
const t13 = {
  input: `nppdvjthqldpwncqszvftbrmjlhg`,
  expected: 6,
};
const t14 = {
  input: `nznrnfrfntjfmvfwmzdfjlvtqnbhcprsg`,
  expected: 10,
};
const t15 = {
  input: `zcfzfwzzqfrljwzlrfnpqdbhtmscgvjw`,
  expected: 11,
};

function parseInput(rawInput: string) {
  return rawInput.split("");
}

function getUniqNPos(input: string[], offset: number): number | undefined {
  for (let i = 0; i < input.length - offset; i++) {
    const set = new Set(input.slice(i, i + offset));
    if (set.size === offset) return i + offset;
  }
}

export function solvePart1(rawInput: string) {
  const input = parseInput(rawInput);

  return getUniqNPos(input, 4);
}

const t2 = {
  ...t1,
  expected: 19,
};

const t22 = {
  ...t12,
  expected: 23,
};

const t23 = {
  ...t13,
  expected: 23,
};

const t24 = {
  ...t14,
  expected: 29,
};

const t25 = {
  ...t15,
  expected: 26,
};

export function solvePart2(rawInput: string) {
  const input = parseInput(rawInput);
  return getUniqNPos(input, 14);
}

export const tests = [
  [t1, t12, t13, t14, t15],
  [t2, t22, t23, t24, t25],
];
export const onlyTests = false;
