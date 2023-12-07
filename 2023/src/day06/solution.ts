import { cl } from "../utils/index.js";

const t1 = {
  input: `Time:      7  15   30
Distance:  9  40  200`,
  expected: 288,
};

// f(x) = -x^2 + tx - d
function parseInput(rawInput: string): number[][] {
  return rawInput.split("\n").map(l =>
    l
      .split(":")[1]
      .split(" ")
      .filter(d => d !== "")
      .map(n => +n),
  );
}

function getEqRoots(a: number, b: number, c: number): [number, number] {
  const disc = Math.sqrt(b ** 2 - 4 * a * c);
  return [(-b + disc) / (2 * a), (-b - disc) / (2 * a)].map(r => +r.toFixed(8)).nSort() as [number, number];
}

export function solvePart1(rawInput: string) {
  const [times, distances] = parseInput(rawInput);
  return times
    .map((t, i) => {
      const d = distances[i];
      const [r1, r2] = getEqRoots(-1, t, -d);
      return Math.ceil(r2) - Math.floor(r1) - 1;
    })
    .reduce((a, b) => a * b);
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
