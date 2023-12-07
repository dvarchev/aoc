import { cl } from "../utils/index.js";

const t1 = {
  input: `Time:      7  15   30
Distance:  9  40  200`,
  expected: 288,
};

function parseInput(rawInput: string): [number[], number[]] {
  return rawInput.split("\n").map(l =>
    l
      .split(":")[1]
      .split(" ")
      .filter(d => d !== "")
      .map(n => +n),
  ) as [number[], number[]];
}

function getWays(t: number, d: number): number {
  let startD = 0,
    endD = 0,
    startT = 0,
    endT = t;
  while (startD <= d) {
    startT++;
    startD = (t - startT) * startT;
  }
  while (endD <= d) {
    endT--;
    endD = (t - endT) * endT;
  }
  return endT - startT + 1;
}

export function solvePart1(rawInput: string) {
  const [times, distances] = parseInput(rawInput);
  const ways = times.map((t, i) => {
    const d = distances[i];
    return getWays(t, d);
  });
  return ways.reduce((a, b) => a * b);
}

const t2 = {
  input: `Time:      71530
Distance:  940200`,
  expected: 71503,
};

export function solvePart2(rawInput: string) {
  return solvePart1(rawInput.split(" ").join(""));
}

export const tests = [[t1], [t2]];
export const onlyTests = false;
