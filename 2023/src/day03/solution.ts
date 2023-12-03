import { cl, getNeighbours, isDigit, iterateMat, matrixFromString } from "../utils/index.js";

const t1 = {
  input: `467..114..
...*......
..35..633.
......#...
617*......
.....+.58.
..592.....
......755.
...$.*....
.664.598..`,
  expected: 4361,
};

function parseInput(rawInput: string) {
  return matrixFromString(rawInput);
}

const isSymbol = (c: string): boolean => c !== "." && !isDigit(c);

function hasSymbolNeighbour(i: number, j: number, mat: string[][]): boolean {
  const neighbours = getNeighbours(mat, i, j);
  return neighbours.some(([c]) => isSymbol(c));
}

export function solvePart1(rawInput: string) {
  const mat = parseInput(rawInput);
  const numbers: number[] = [];

  iterateMat(mat, (c, i, j) => {
    if (isDigit(c) && (j == mat[0].length - 1 || !isDigit(mat[i][j + 1]))) {
      let cj = j;
      let num = "";
      let isPart = false;
      while (isDigit(mat[i][cj])) {
        num = mat[i][cj] + num;
        if (hasSymbolNeighbour(i, cj, mat)) isPart = true;
        cj--;
      }
      if (isPart) numbers.push(+num);
    }
  });

  return numbers.sum();
}

const t2 = {
  ...t1,
  expected: 467835,
};

function getNumberAt(i: number, j: number, mat: string[][]): [number, number, number] {
  let ns = j,
    ne = j;
  if (isDigit(mat[i][j])) {
    while (isDigit(mat[i][ns - 1])) ns--;
    while (isDigit(mat[i][ne + 1])) ne++;
    return [+mat[i].slice(ns, ne + 1).join(""), ns, ne];
  }
  return [-1, 0, 0];
}

function getAdjNumbers(i: number, j: number, mat: string[][]): number[] {
  const res = [] as number[];
  const neighbours = getNeighbours(mat, i, j);
  const found = {} as any;
  neighbours.forEach(([nn, ci, cj]) => {
    const [n, ns, ne] = getNumberAt(ci, cj, mat);
    if (n >= 0 && !found[`${ci};${ns};${ne}`]) {
      found[`${ci};${ns};${ne}`] = true;
      res.push(n);
    }
  });
  return res;
}

export function solvePart2(rawInput: string) {
  const mat = parseInput(rawInput);

  const ratios: number[] = [];
  iterateMat(mat, (c, i, j) => {
    if (c === "*") {
      const adjNums = getAdjNumbers(i, j, mat);
      if (adjNums.length === 2) {
        const [n1, n2] = adjNums;
        ratios.push(n1 * n2);
      }
    }
  });

  return ratios.sum();
}

export const tests = [[t1], [t2]];
export const onlyTests = false;
