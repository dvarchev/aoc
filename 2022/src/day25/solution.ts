import { cl } from "../utils/index.js";

const t1 = {
  input: `1=-0-2
12111
2=0=
21
2=01
111
20012
112
1=-1=
1-12
12
1=
122`,
  expected: "2=-1=0",
};
const charMap = {
  "0": 0,
  "1": 1,
  "2": 2,
  "=": -2,
  "-": -1,
};
const symbols = "012=-";
function parseInput(rawInput: string) {
  return rawInput.split("\n").map(snafuToDec);
}

function snafuToDec(snafu: string): number {
  const digits = snafu.split("").map(ch => charMap[ch as keyof typeof charMap]);
  let result = 0;
  while (digits.length) {
    let digit = digits.shift()!;
    result = result * 5 + digit;
  }
  return result;
}
function decToSnafu(num: number): string {
  let result = "";
  let mod = 0;
  while (num !== 0) {
    mod = num % 5;
    if (mod > 2) num += 5;

    num = Math.floor(num / 5);
    result = symbols[mod] + result;
  }
  return result;
}
export function solvePart1(rawInput: string) {
  const numbers = parseInput(rawInput);
  const sum = numbers.sum();
  return decToSnafu(sum);
}

const t2 = {
  ...t1,
  expected: "",
};

export function solvePart2(rawInput: string) {
  return "";
}

export const tests = [[t1], [t2]];
export const onlyTests = false;
