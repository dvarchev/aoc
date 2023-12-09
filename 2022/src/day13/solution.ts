import { Config, cl } from "aoc-utils";

const t1 = {
  input: `[1,1,3,1,1]
[1,1,5,1,1]

[[1],[2,3,4]]
[[1],4]

[9]
[[8,7,6]]

[[4,4],4,4]
[[4,4],4,4,4]

[7,7,7,7]
[7,7,7]

[]
[3]

[[[]]]
[[]]

[1,[2,[3,[4,[5,6,7]]]],8,9]
[1,[2,[3,[4,[5,6,0]]]],8,9]`,
  expected: 13,
};

function parseInput(rawInput: string) {
  return rawInput.split("\n\n").map(p => p.split("\n").map(l => JSON.parse(l)));
}

function compare(f: any, s: any): boolean | undefined {
  if (Number.isInteger(f) && Number.isInteger(s)) {
    if (f < s) return true;
    else if (s < f) return false;
    return;
  }

  if (Array.isArray(f) && Array.isArray(s)) {
    for (let i = 0; i < f.length; i++) {
      const fi = f[i],
        si = s[i];
      if (si === undefined) return false;
      const ii = compare(fi, si);
      if (ii !== undefined) return ii;
    }
    if (s.length > f.length) return true;
    return;
  }

  if (Array.isArray(f) && Number.isInteger(s)) {
    s = [s];
    return compare(f, s);
  }
  if (Array.isArray(s) && Number.isInteger(f)) {
    f = [f];
    return compare(f, s);
  }
}
export function solvePart1(rawInput: string) {
  const input = parseInput(rawInput);
  const ind = input.map(([f, s], i) => (compare(f, s) ? i + 1 : 0));
  return ind.sum();
}

const t2 = {
  ...t1,
  expected: 140,
};

export function solvePart2(rawInput: string) {
  const input = parseInput(rawInput);
  const dividers = [[[2]], [[6]]];
  const toSort = [...dividers];
  input.forEach(p => toSort.push(...p));
  const sorted = toSort.sort((a, b) => (compare(a, b) ? -1 : 1)).map(e => JSON.stringify(e));
  const dStr = dividers.map(d => JSON.stringify(d));
  const [n1, n2] = dStr.map(d => sorted.findIndex(e => e === d) + 1);

  return n1 * n2;
}

export const tests = [[t1], [t2]];
export const config: Config = {
  onlyTests: false,
};
