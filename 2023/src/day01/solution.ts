import { cl, Config } from "aoc-utils";

const t1 = {
  input: `1abc2
  pqr3stu8vwx
  a1b2c3d4e5f
  treb7uchet`,
  expected: 142,
};

function parseInput(rawInput: string) {
  return rawInput.split("\n").filter(l => l.length > 0);
  // .map(l => l.split(''));
}
const digits = "123456789".split("");
const digitNames = ["one", "two", "three", "four", "five", "six", "seven", "eight", "nine"];

export function solvePart1(rawInput: string) {
  const input = parseInput(rawInput);
  const digitsArr = input.map(l => {
    const firstIndex = digits
      .map(d => l.indexOf(d))
      .filter(n => n !== -1)
      .min();
    const lastIndex = digits
      .map(d => l.lastIndexOf(d))
      .filter(n => n !== -1)
      .max();

    return +l[firstIndex] * 10 + +l[lastIndex];
  });
  return digitsArr.sum();
}

const t2 = {
  input: `two1nine
  eightwothree
  abcone2threexyz
  xtwone3four
  4nineeightseven2
  zoneight234
  7pqrstsixteen`,
  expected: 281,
};

export function solvePart2(rawInput: string) {
  const input = parseInput(rawInput);
  const digitsArr = input.map(l => {
    const firstIndexD = digits
      .map(d => l.indexOf(d))
      .filter(n => n !== -1)
      .min();
    const lastIndexD = digits
      .map(d => l.lastIndexOf(d))
      .filter(n => n !== -1)
      .max();

    const firstIndexL = digitNames
      .map(d => l.indexOf(d))
      .filter(n => n !== -1)
      .min();
    const lastIndexL = digitNames
      .map(d => l.lastIndexOf(d))
      .filter(n => n !== -1)
      .max();

    let fd = +l[firstIndexD];
    let ld = +l[lastIndexD];
    if (firstIndexD > firstIndexL) fd = digitNames.findIndex(dn => l.indexOf(dn) == firstIndexL) + 1;

    if (lastIndexD < lastIndexL) ld = digitNames.findIndex(dn => l.indexOf(dn, lastIndexL) == lastIndexL) + 1;

    return fd * 10 + ld;
  });
  return digitsArr.sum();
}

export const tests = [[t1], [t2]];
export const config: Config = {
  onlyTests: false,
};

