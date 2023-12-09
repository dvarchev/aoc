import { Config, cl, matrixN } from "aoc-utils";

const t1 = {
  input: `498,4 -> 498,6 -> 496,6
503,4 -> 502,4 -> 502,9 -> 494,9`,
  expected: 24,
};

function parseInput(rawInput: string) {
  return rawInput.split("\n").map(l => l.split(" -> ").map(p => p.split(",").map(n => +n)));
}
function drop(mat: number[][], max: number) {
  let [cx, cy] = [500, 0];
  while (cy < max + 2) {
    if (mat[cy + 1][cx] === 0) {
      cy++;
      continue;
    }
    if (mat[cy + 1][cx - 1] === 0) {
      cy++;
      cx--;
      continue;
    }
    if (mat[cy + 1][cx + 1] === 0) {
      cy++;
      cx++;
      continue;
    }
    if (cx === 500 && cy === 0 && mat[cy][cx] !== 0) return;
    mat[cy][cx] = 2;
    return [cx, cy];
  }
}
function getMat(input: number[][][]): [number[][], number] {
  const matr = matrixN(900, 900);
  let maxY = 0;
  input.forEach(([[sx, sy], ...next]) => {
    matr[sy][sx] = 1;
    maxY = Math.max(maxY, sy);
    next.forEach(([nx, ny]) => {
      while (sx !== nx || sy !== ny) {
        if (sx !== nx) {
          sx += sx < nx ? 1 : -1;
        }
        if (sy !== ny) {
          sy += sy < ny ? 1 : -1;
        }
        maxY = Math.max(maxY, sy);
        matr[sy][sx] = 1;
      }
    });
  });
  return [matr, maxY];
}
export function solvePart1(rawInput: string) {
  const input = parseInput(rawInput);
  const [mat, maxY] = getMat(input);
  // clm(mat, ".#o",[0, 490], [15, 515]);
  let land = drop(mat, maxY);
  let count = 0;

  while (land) {
    land = drop(mat, maxY);
    count++;
  }
  return count;
}

const t2 = {
  ...t1,
  expected: 93,
};

export function solvePart2(rawInput: string) {
  const input = parseInput(rawInput);
  const [mat, maxY] = getMat(input);

  for (let i = 0; i < mat[0].length; i++) mat[maxY + 2][i] = 1;
  let land = drop(mat, maxY);
  let count = 0;
  while (land) {
    land = drop(mat, maxY);
    count++;
  }
  // clm(mat, ".#o",[0, 480], [15, 520]);
  return count;
}

export const tests = [[t1], [t2]];
export const config: Config = {
  onlyTests: false,
};
