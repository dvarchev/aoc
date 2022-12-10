import _ from "lodash";
import { cl } from "../utils/index.js";

const t1 = {
  input: `    [D]    
[N] [C]    
[Z] [M] [P]
 1   2   3 

move 1 from 2 to 1
move 3 from 1 to 3
move 2 from 2 to 1
move 1 from 1 to 2`,
  expected: "CMZ",
};

function parseInput(rawInput: string): {
  crates: string[][];
  moves: [number, number, number][];
} {
  const [stateLines, moveLines] = rawInput.split("\n\n");
  const state = stateLines.split("\n").reverse();

  const indexes = Array.from(state[0].matchAll(/\d/g)).map((x) => x.index!);
  const count = indexes.length;
  const crates = _.times<string[]>(count, () => []);
  state
    .slice(1)
    .forEach((sl) =>
      indexes.forEach((i, j) => sl[i] !== " " && crates[j].push(sl[i])),
    );

  const moves = moveLines
    .split("\n")
    .map((l) => l.split(" "))
    .map((la): [number, number, number] => [+la[1], +la[3] - 1, +la[5] - 1]);
  return { crates, moves };
}

function moveCrates(
  crates: string[][],
  [nm, from, to]: [number, number, number],
  reverse: boolean = false,
) {
  const nToMove = crates[from].length - nm;
  const toMove = reverse
    ? crates[from].slice(nToMove).reverse()
    : crates[from].slice(nToMove);

  crates[to].push(...toMove);
  crates[from] = crates[from].slice(0, nToMove);
}

export function solvePart1(rawInput: string) {
  const { crates, moves } = parseInput(rawInput);
  moves.forEach((move) => moveCrates(crates, move, true));
  return crates.map((c) => c.pop()).join("");
}

const t2 = {
  ...t1,
  expected: "MCD",
};

export function solvePart2(rawInput: string) {
  const { crates, moves } = parseInput(rawInput);
  moves.forEach((move) => moveCrates(crates, move));
  return crates.map((c) => c.pop()).join("");
}

export const tests = [[t1], [t2]];
export const onlyTests = false;
