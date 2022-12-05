import run from "aocrunner";
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
  crates: any[];
  moves: [number, number, number][];
} {
  const [stateLines, moveLines] = rawInput.split("\n\n");
  const state = stateLines.split("\n").reverse();

  const indexes = Array.from(state[0].matchAll(/\d/g)).map((x) => x.index);
  const count = indexes.length;
  const crates = [...new Array(count)].map((): string[] => []);
  state.slice(1).forEach((sl) => {
    indexes.forEach((i, j) => {
      const char = sl[i!];
      if (char !== " ") {
        crates[j].push(char);
      }
    });
  });

  const moves = moveLines
    .split("\n")
    .map((l) => l.split(" "))
    .map((la): [number, number, number] => [+la[1], +la[3] - 1, +la[5] - 1]);
  return { crates, moves };
}

function solvePart1(rawInput: string) {
  const { crates, moves } = parseInput(rawInput);

  const moveCrates = ([nm, from, to]: [number, number, number]): void => {
    const nToMove = crates[from].length - nm;
    const toMove = crates[from].slice(nToMove).reverse();
    crates[to].push(...toMove);
    crates[from] = crates[from].slice(0, nToMove);
  };
  moves.forEach(moveCrates);
  const result = crates.map((c) => c.pop()).join("");
  // cl(result)
  return result;
}

const t2 = {
  ...t1,
  expected: "MCD",
};

function solvePart2(rawInput: string) {
  const { crates, moves } = parseInput(rawInput);

  const moveCrates = ([nm, from, to]: [number, number, number]): void => {
    const nToMove = crates[from].length - nm;
    const toMove = crates[from].slice(nToMove);
    crates[to].push(...toMove);
    crates[from] = crates[from].slice(0, nToMove);
  };
  moves.forEach(moveCrates);
  return crates.map((c) => c.pop()).join("");
}

run({
  part1: {
    tests: [t1],
    solution: solvePart1,
  },
  part2: {
    tests: [t2],
    solution: solvePart2,
  },
  trimTestInputs: false,
  onlyTests: false,
});
