import { Config, charMap, cl } from "aoc-utils";

const t1 = {
  input: `vJrwpWtwJgWrhcsFMMfFFhFp
jqHRNqRjqzjGDLGLrsFMfFZSrLrFZsSL
PmmdzqPrVvPwwTWBwg
wMqvLMZHhHMvwLHjbvcjnnSBnvTQFn
ttgJtRGJQctTZtZT
CrZsJsPPZsGzwwsLwLmpwMDw`,
  expected: 157,
};

const ac = charMap["a"];
const Ac = charMap["A"];

function parseInput(rawInput: string) {
  return rawInput.split("\n");
}

const toCode = (cc: number) => (cc < ac ? cc - Ac + 27 : cc - ac + 1);

export function solvePart1(rawInput: string) {
  const input = parseInput(rawInput).map(l => l.chunk(l.length / 2).map(c => c.toArray()));
  return input
    .map(([c1, c2]) => c1.find((c: string) => c2.includes(c))!.charCodeAt(0))
    .map(toCode)
    .sum();
}

const t2 = {
  ...t1,
  expected: 70,
};

export function solvePart2(rawInput: string) {
  const input = parseInput(rawInput);

  return input
    .chunk(3)
    .map(ch => ch.map(l => l.toArray()))
    .map(([c1l, c2l, c3l]): number => c1l.find((c: string) => c2l.includes(c) && c3l.includes(c))!.charCodeAt(0))
    .map(toCode)
    .sum();
}

export const tests = [[t1], [t2]];
export const config: Config = {
  onlyTests: false,
};
