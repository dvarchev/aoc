import { Config, cl } from "aoc-utils";

const t1 = {
  input: `1
2
-3
3
-2
0
4`,
  expected: 3,
};

function parseInput(rawInput: string): number[] {
  return rawInput.split("\n").map(n => +n);
}

function getNewIndex(currentIndex: number, n: number, len: number) {
  let newIndex = currentIndex + n;
  if (newIndex < 0) newIndex = len + (newIndex % len);
  else newIndex = newIndex % len;
  if (newIndex === 0) newIndex = len;
  return newIndex;
}

export function solvePart1(rawInput: string, mult: number = 1, mix: number = 1) {
  let input = parseInput(rawInput).map(n => ({ n: n * mult }));
  const original = [...input];
  const len = input.length;
  for (let m = 0; m < mix; m++) {
    for (let i = 0; i < len; i++) {
      const currentItem = original[i];
      const currentIndex = input.indexOf(currentItem);
      let newIndex = getNewIndex(currentIndex, currentItem.n, len - 1);

      input.splice(currentIndex, 1);
      input.splice(newIndex, 0, currentItem);
    }
  }
  const mixed = input.map(it => it.n);
  const zeroAt = mixed.indexOf(0);
  const k = (zeroAt + 1000) % len;
  const k2 = (zeroAt + 2000) % len;
  const k3 = (zeroAt + 3000) % len;

  return mixed[k] + mixed[k2] + mixed[k3];
}

const t2 = {
  ...t1,
  expected: 1623178306,
};

export function solvePart2(rawInput: string) {
  return solvePart1(rawInput, 811589153, 10);
}

export const tests = [[t1], [t2]];

export const config: Config = {
  onlyTests: false,
};
