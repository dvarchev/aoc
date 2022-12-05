import run from "aocrunner";
import _ from "lodash";
import { cl } from "../utils/index.js";

const ac = "a".charCodeAt(0);
const zc = "z".charCodeAt(0);
const Ac = "A".charCodeAt(0);

const t1 = {
  input: `vJrwpWtwJgWrhcsFMMfFFhFp
jqHRNqRjqzjGDLGLrsFMfFZSrLrFZsSL
PmmdzqPrVvPwwTWBwg
wMqvLMZHhHMvwLHjbvcjnnSBnvTQFn
ttgJtRGJQctTZtZT
CrZsJsPPZsGzwwsLwLmpwMDw`,
  expected: 157,
};

function parseInput(rawInput: string) {
  return rawInput.split("\n");
}

const toCode = (cc: number) => (cc <= zc && cc >= ac ? cc - ac + 1 : cc - Ac + 27);

function solvePart1(rawInput: string) {
  const input = parseInput(rawInput).map((l) => _.chunk(l, l.length/2));

  const repeat = input
    .map(([c1, c2]) => {
      const c1lr = _.find(c1, (c: string) => _.includes(c2, c));
      return c1lr!.charCodeAt(0);
    })
    .map(toCode);
  return _.sum(repeat);
}

const t2 = {
  ...t1,
  expected: 70,
};

function solvePart2(rawInput: string) {
  const input = parseInput(rawInput);

  const repeat2 = _.chunk(input, 3)
    .map(([l1, l2, l3]): number => {
      const c1l = l1.split("");
      const c2l = l2.split("");
      const c3l = l3.split("");
      const cr = _.find(
        c1l,
        (c: string) => _.includes(c2l, c) && _.includes(c3l, c),
      );
      return cr!.charCodeAt(0);
    })
    .map(toCode);

  return _.sum(repeat2);
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
