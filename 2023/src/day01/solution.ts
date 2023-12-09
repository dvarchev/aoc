import { cl, Config, isDigit } from "aoc-utils";

const t1 = {
  input: `1abc2
pqr3stu8vwx
a1b2c3d4e5f
treb7uchet`,
  expected: 142,
};

function parseInput(rawInput: string) {
  return rawInput.lines().filter(l => l.length > 0);
}
const digits = "123456789".toArray();
const digitNames = ["zero", "one", "two", "three", "four", "five", "six", "seven", "eight", "nine"];

export function solvePart1(rawInput: string) {
  const input = parseInput(rawInput);
  const digitsArr = input.map(l => {
    const la = l.toArray();
    const firstDigit = +la.find(isDigit)!;
    const lastDigit = +la.reverse().find(isDigit)!;

    return firstDigit * 10 + lastDigit;
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
    const la = l.toArray();
    const lar = [...la].reverse();
    const firstDigitI = la.findIndex(isDigit);
    const lastDigitI = lar.length - lar.findIndex(isDigit) - 1;

    const firstIndexL = digitNames
      .map(d => l.indexOf(d))
      .filter(n => n !== -1)
      .min();
    const lastIndexL = digitNames
      .map(d => l.lastIndexOf(d))
      .filter(n => n !== -1)
      .max();

    let fd = +la[firstDigitI];
    let ld = +la[lastDigitI];
    if (firstDigitI > firstIndexL || firstDigitI === -1) fd = digitNames.findIndex(dn => l.indexOf(dn) == firstIndexL);

    if (lastDigitI < lastIndexL || lastDigitI === la.length)
      ld = digitNames.findIndex(dn => l.indexOf(dn, lastIndexL) == lastIndexL);

    return fd * 10 + ld;
  });
  return digitsArr.sum();
}

export const tests = [[t1], [t2]];
export const config: Config = {
  onlyTests: false,
};
