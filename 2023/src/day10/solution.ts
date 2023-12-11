import { Config, isWithinMatrix, iterateMat, matrix, matrixFromString, matrixN } from "aoc-utils";

const t1 = {
  input: `..F7.
.FJ|.
SJ.L7
|F--J
LJ...`,
  expected: 8,
};
type Point = [number, number];
const up: Point = [-1, 0];
const down: Point = [1, 0];
const left: Point = [0, -1];
const right: Point = [0, 1];

const transitionMap: { [key: string]: number | Point[] } = {
  ".": 0,
  "-": [left, right],
  "|": [up, down],
  F: [right, down],
  J: [up, left],
  S: [up, right, left, down],
  L: [up, right],
  "7": [left, down],
};
function canVisit(input: string[][], x: number, y: number, nx: number, ny: number) {
  const n = input[nx][ny];
  if (n === ".") return false;
  if (n === "-") return x === nx;
  if (n === "|") return y === ny;
  if (n === "F") return y - ny === 1 || x - nx === 1;
  if (n === "J") return ny - y === 1 || nx - x === 1;
  if (n === "S") return true;
  if (n === "L") return y - ny === 1 || nx - x === 1;
  if (n === "7") return ny - y === 1 || x - nx === 1;
  return true;
}
export function solvePart1(rawInput: string) {
  const input = matrixFromString(rawInput);
  const [height, width] = [input.length, input[0].length];
  let start = [0, 0];
  const matTransitions = matrix(height, width, 0 as number | number[][]);
  iterateMat(input, (n, l, c) => {
    matTransitions[l][c] = transitionMap[n];
    if (n === "S") {
      start = [l, c];
    }
  });
  const matVisited = matrixN(height, width);
  const visited = matrixN(height, width, -1);
  const queue = [start];
  while (queue.length > 0) {
    const [x, y] = queue.shift()!;
    if (visited[x][y] === 1) continue;
    visited[x][y] = 1;
    const neighbours = matTransitions[x][y];
    if (neighbours === 0) continue;
    for (const [dx, dy] of neighbours as Point[]) {
      const [nx, ny] = [x + dx, y + dy];
      if (!isWithinMatrix(input, nx, ny)) continue;
      if (visited[nx][ny] === 1) continue;
      if (!canVisit(input, x, y, nx, ny)) continue;
      matVisited[nx][ny] = matVisited[x][y] + 1;
      queue.push([nx, ny]);
    }
  }
  const max = matVisited.flat().max();
  return max;
}

const t21 = {
  input: `..........
.S------7.
.|F----7|.
.||....||.
.||....||.
.|L-7F-J|.
.|..||..|.
.L--JL--J.
..........`,
  expected: 4,
};
const t22 = {
  input: `.F----7F7F7F7F-7....
.|F--7||||||||FJ....
.||.FJ||||||||L7....
FJL7L7LJLJ||LJ.L-7..
L--J.L7...LJS7F-7L7.
....F-J..F7FJ|L7L7L7
....L7.F7||L7|.L7L7|
.....|FJLJ|FJ|F7|.LJ
....FJL-7.||.||||...
....L---J.LJ.LJLJ...`,
  expected: 8,
};
const t23 = {
  input: `FF7FSF7F7F7F7F7F---7
L|LJ||||||||||||F--J
FL-7LJLJ||||||LJL-77
F--JF--7||LJLJ7F7FJ-
L---JF-JLJ.||-FJLJJ7
|F|F-JF---7F7-L7L|7|
|FFJF7L7F-JF7|JL---7
7-L-JL7||F7|L7F-7F7|
L.L7LFJ|||||FJL7||LJ
L7JLJL-JLJLJL--JLJ.L`,
  expected: 10,
};

export function solvePart2(rawInput: string) {
  const input = matrixFromString(rawInput);
  const [height, width] = [input.length, input[0].length];
  let start = [0, 0];
  const matTransitions = matrix(height, width, 0 as number | number[][]);
  iterateMat(input, (n, l, c) => {
    matTransitions[l][c] = transitionMap[n];
    if (n === "S") {
      start = [l, c];
    }
  });
  const visited = matrixN(height, width);
  const queue = [start];
  const path: Point[] = [];
  while (queue.length > 0) {
    const [x, y] = queue.shift()!;
    if (visited[x][y] === 1) continue;
    visited[x][y] = 1;
    path.push([x, y]);

    const neighbours = matTransitions[x][y];
    if (neighbours === 0) continue;

    const toVisit = [];
    for (const [dx, dy] of neighbours as number[][]) {
      const [nx, ny] = [x + dx, y + dy];
      if (nx < 0 || nx >= input.length || ny < 0 || ny >= input[0].length) continue;
      if (visited[nx][ny] === 1) continue;
      if (!canVisit(input, x, y, nx, ny)) continue;
      toVisit.push([nx, ny]);
    }
    queue.unshift(...toVisit);
  }
  const [n1, n2] = path;
  const pathLong = [...path, n1, n2];
  const pathCycle = [...path, n1];
  const [leftTurns, rightTurns] = countTurns(pathLong);
  const colorV = leftTurns > rightTurns ? colorLeft : colorRight;
  const coloredMat = matrix(height, width, 0);

  path.forEach(([x, y]) => {
    coloredMat[x][y] = 1;
  });

  for (let i = 0; i < pathCycle.length - 1; i++) {
    const [x1, y1] = pathCycle[i];
    const [x2, y2] = pathCycle[i + 1];
    const [dx, dy] = [x2 - x1, y2 - y1];
    const [dx1, dy1] = colorV[`${dx},${dy}`];

    const [cx1, cy1] = [x1 + dx1, y1 + dy1];
    if (!isWithinMatrix(coloredMat, cx1, cy1)) continue;
    const [cx2, cy2] = [x2 + dx1, y2 + dy1];
    if (!isWithinMatrix(coloredMat, cx2, cy2)) continue;

    if (coloredMat[cx1][cy1] === 0) coloredMat[cx1][cy1] = 2;
    if (coloredMat[cx2][cy2] === 0) coloredMat[cx2][cy2] = 2;
  }
  floodColor(coloredMat, 2);

  const twoCount = coloredMat.flat().filter(n => n === 2).length;
  return twoCount;
}
const colorLeft: { [key: string]: Point } = {
  "0,1": up,
  "0,-1": down,
  "1,0": right,
  "-1,0": left,
};
const colorRight: { [key: string]: Point } = {
  "0,1": down,
  "0,-1": up,
  "1,0": left,
  "-1,0": right,
};
function countTurns(pathLong: Point[]): Point {
  let leftTurns = 0;
  let rightTurns = 0;
  for (let i = 0; i < pathLong.length - 2; i++) {
    const [x1, y1] = pathLong[i];
    const [x2] = pathLong[i + 1];
    const [x3, y3] = pathLong[i + 2];
    const [dx3, dy3] = [x3 - x1, y3 - y1];
    if (Math.abs(dx3) === 1 && Math.abs(dy3) === 1) {
      const dx1 = x2 - x1;
      if (dx3 + dy3 === 0) {
        dx1 === 0 ? leftTurns++ : rightTurns++;
      } else {
        dx1 === 0 ? rightTurns++ : leftTurns++;
      }
    }
  }
  return [leftTurns, rightTurns];
}
function floodColor(coloredMat: number[][], colorToFlood: number) {
  const queue: Point[] = [];
  iterateMat(coloredMat, (n, l, c) => {
    if (n === colorToFlood) queue.push([l, c]);
  });
  while (queue.length > 0) {
    const [x, y] = queue.shift()!;
    if (coloredMat[x][y] === 1) continue;
    coloredMat[x][y] = colorToFlood;
    const neighbours = [
      [x + 1, y],
      [x - 1, y],
      [x, y + 1],
      [x, y - 1],
    ];
    for (const [nx, ny] of neighbours) {
      if (!isWithinMatrix(coloredMat, nx, ny)) continue;
      if (coloredMat[nx][ny] !== 0) continue;
      queue.push([nx, ny]);
    }
  }
}

export const tests = [[t1], [t21, t22, t23]];
export const config: Config = {
  onlyTests: false,
};
