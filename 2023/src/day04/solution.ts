import { cl, Config } from "aoc-utils";

const t1 = {
  input: `Card 1: 41 48 83 86 17 | 83 86  6 31 17  9 48 53
Card 2: 13 32 20 16 61 | 61 30 68 82 17 32 24 19
Card 3:  1 21 53 59 44 | 69 82 63 72 16 21 14  1
Card 4: 41 92 73 84 69 | 59 84 76 51 58  5 54 83
Card 5: 87 83 26 28 32 | 88 30 70 12 93 22 82 36
Card 6: 31 18 13 56 72 | 74 77 10 23 35 67 36 11`,
  expected: 13,
};

function parseInput(rawInput: string): [number[], number[]][] {
  return rawInput.split("\n").map(l =>
    l
      .split(":")[1]
      .split("|")
      .map(c =>
        c
          .split(" ")
          .filter(c => c !== "")
          .map(n => +n),
      ),
  ) as [number[], number[]][];
}

export function solvePart1(rawInput: string) {
  const matchingNumbers = getMatchingNumbers(rawInput);

  return matchingNumbers.map(n => (n ? Math.pow(2, n - 1) : 0)).sum();
}

const t2 = {
  ...t1,
  expected: 30,
};

function getMatchingNumbers(rawInput: string) {
  const input = parseInput(rawInput);

  const matchingNumbers = input.map(([w, c]) => w.filter(l => c.includes(l)).length);
  return matchingNumbers;
}

export function solvePart2(rawInput: string) {
  const matchingNumbers = getMatchingNumbers(rawInput);
  const wonCards = Array.times(matchingNumbers.length, () => 1);
  matchingNumbers.forEach((n, i) => {
    for (let ii = i + 1; ii <= i + n && ii < wonCards.length; ii++) {
      wonCards[ii] += wonCards[i];
    }
  });
  return wonCards.sum();
}

export const tests = [[t1], [t2]];
export const config: Config = {
  onlyTests: false,
};

