import _ from "lodash";
import { cl, readFile } from "../utils/index.js";

const t1 = {
  input: readFile("./test1.txt", import.meta.url),
  expected: 10605,
};

const lineParsers = [
  (tl: string) =>
    tl
      .substring(16)
      .split(", ")
      .map(n => +n),
  (tl: string) => tl.slice(21).split(" "),
  (tl: string) => +tl.substring(19),
  (tl: string) => +tl.substring(25),
  (tl: string) => +tl.substring(26),
];
type monkey = [number[], ["+" | "*", string], number, number, number];

function parseInput(rawInput: string): monkey[] {
  return rawInput.split("\n\n").map(
    m =>
      m
        .split("\n")
        .slice(1)
        .map((ml, i) => lineParsers[i](ml.trim())) as monkey,
  );
}

const ops = {
  "+": (a: number, b: number) => a + b,
  "*": (a: number, b: number) => a * b,
};

function playRound(input: monkey[], reviewedItems: number[], relief: (n: number) => number) {
  input.forEach(([items, [operation, arg], divBy, trueMonkey, falseMonkey], mi) => {
    items.forEach(itm => {
      let newLevel = ops[operation](itm, arg === "old" ? itm : +arg);
      newLevel = relief(newLevel);
      const targetMonkey = newLevel % divBy === 0 ? input[trueMonkey][0] : input[falseMonkey][0];
      targetMonkey.push(newLevel);
    });
    reviewedItems[mi] += items.length;
    items.length = 0;
  });
}
function playRounds(input: monkey[], rounds: number, relief: (n: number) => number) {
  let reviewedItems: number[] = input.map(_m => 0);
  while (rounds > 0) {
    playRound(input, reviewedItems, relief);
    rounds--;
  }
  return reviewedItems;
}

export function solvePart1(rawInput: string) {
  const input = parseInput(rawInput);
  const reviewed = playRounds(input, 20, n => Math.floor(n / 3));
  const sorted = reviewed.sort((a, b) => b - a);
  return sorted[0] * sorted[1];
}

const t2 = {
  ...t1,
  expected: 2713310158,
};

export function solvePart2(rawInput: string) {
  const input = parseInput(rawInput);
  const prod = input.map(m => m[2]).reduce((a, b) => a * b);
  const reviewed = playRounds(input, 10_000, n => n % prod);
  const sorted = reviewed.sort((a, b) => b - a);
  return sorted[0] * sorted[1];
}

export const tests = [[t1], [t2]];
export const onlyTests = false;
