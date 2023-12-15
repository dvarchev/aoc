import { cl, clm, Config, iterateMat, matrixFromString, transposeMat } from "aoc-utils";

const t1 = {
  input: `O....#....
O.OO#....#
.....##...
OO.#O....O
.O.....O#.
O.#..O.#.#
..O..#O..O
.......O..
#....###..
#OO..#....`,
  expected: 136,
};

function parseInput(rawInput: string) {
  return matrixFromString(rawInput);
}

function tiltTo(input: string[][], direction: "left" | "right" | "up" | "down") {
  let transposed;
  if (direction === "up" || direction === "down") transposed = transposeMat(input);
  else transposed = input;

  transposed.forEach((line, l) => {
    if (direction === "down" || direction === "right") line.reverse();
    let moved;
    do {
      moved = false;
      for (let i = 1; i < line.length; i++) {
        if (line[i] === "O" && line[i - 1] === ".") {
          line[i] = ".";
          line[i - 1] = "O";
          moved = true;
        }
      }
    } while (moved);
    if (direction === "down" || direction === "right") line.reverse();
  });
  if (direction === "up" || direction === "down") return transposeMat(transposed);
  return transposed;
}

function weighRocks(mat: string[][]) {
  const tiltedMat = transposeMat(mat);
  let result = 0;
  const columns = tiltedMat[0].length;
  iterateMat(tiltedMat, (n, l, c) => {
    if (n === "O") result += columns - c;
  });
  return result;
}

export function solvePart1(rawInput: string) {
  const input = parseInput(rawInput);
  const tiltedMat = tiltTo(input, "up");
  return weighRocks(tiltedMat);
}

const t2 = {
  ...t1,
  expected: 64,
};

function cycleMatrix(input: string[][]) {
  let tiltedMat = input;
  tiltedMat = tiltTo(tiltedMat, "up");
  tiltedMat = tiltTo(tiltedMat, "left");
  tiltedMat = tiltTo(tiltedMat, "down");
  tiltedMat = tiltTo(tiltedMat, "right");
  return tiltedMat;
}

function getMatrixKey(mat: string[][]) {
  return mat.map(l => l.join("")).join("");
}
export function solvePart2(rawInput: string) {
  const input = parseInput(rawInput);
  let matKey = getMatrixKey(input);
  const seen = new Map<string, number>();
  let cycle = 0;
  let currentMatrix = input;
  const weights = [];
  weights.push(weighRocks(currentMatrix));
  while (!seen.has(matKey)) {
    seen.set(matKey, cycle);
    currentMatrix = cycleMatrix(currentMatrix);
    weights.push(weighRocks(currentMatrix));
    matKey = getMatrixKey(currentMatrix);
    cycle++;
  }
  const maxRounds = 1_000_000_000;
  const cycleStart = seen.get(matKey)!;
  const cycleLenght = cycle - cycleStart;

  const remainingRounds = maxRounds - cycleStart;
  const remaining = remainingRounds % cycleLenght;
  const result = weights[cycleStart + remaining];
  return result;
}

export const tests = [[t1], [t2]];
export const config: Config = {
  onlyTests: false,
};
