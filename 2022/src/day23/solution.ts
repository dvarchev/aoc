import { cl, clm, iterateMat, matrix, subMat } from "../utils/index.js";

const t1 = {
  input: `....#..
..###.#
#...#.#
.#...##
#.###..
##.#.##
.#..#..`,
  expected: 110,
};

function parseInput(rawInput: string) {
  return rawInput.split("\n").map(l => l.split("").map(c => (c === "." ? 0 : 1)));
}

function needsExpansion(mat: number[][]): boolean {
  const topNon0 = mat[0].some(n => n !== 0);
  const bottomNon0 = mat.last()!.some(n => n !== 0);
  const leftRightNon0 = mat.some(l => l[0] !== 0 || l.last() !== 0);
  return topNon0 || bottomNon0 || leftRightNon0;
}

function expandMat(mat: number[][]) {
  mat.forEach(l => {
    l.push(0);
    l.unshift(0);
  });
  const width = mat[0].length;
  mat.unshift(Array.times(width, () => 0));
  mat.push(Array.times(width, () => 0));
}

function expandIfNeeded(mat: number[][]) {
  if (needsExpansion(mat)) {
    expandMat(mat);
  }
}

type Direction = "N" | "S" | "E" | "W";

const offsets: { [key: string]: [number, number][] } = {
  N: [
    [-1, -1],
    [-1, 0],
    [-1, 1],
  ],
  S: [
    [1, -1],
    [1, 0],
    [1, 1],
  ],
  W: [
    [-1, -1],
    [0, -1],
    [1, -1],
  ],
  E: [
    [-1, 1],
    [0, 1],
    [1, 1],
  ],
};

const moveTo: { [key: string]: [number, number] } = {
  N: [-1, 0],
  S: [1, 0],
  W: [0, -1],
  E: [0, 1],
};

function canMove(mat: number[][], l: number, c: number, offsets: number[][]): boolean {
  return offsets.map(o => mat[l + o[0]][c + o[1]]).every(n => n === 0);
}
function canMoveN(mat: number[][], l: number, c: number): Direction | "" {
  return canMove(mat, l, c, offsets.N) ? "N" : "";
}
function canMoveS(mat: number[][], l: number, c: number): Direction | "" {
  return canMove(mat, l, c, offsets.S) ? "S" : "";
}
function canMoveW(mat: number[][], l: number, c: number): Direction | "" {
  return canMove(mat, l, c, offsets.W) ? "W" : "";
}
function canMoveE(mat: number[][], l: number, c: number): Direction | "" {
  return canMove(mat, l, c, offsets.E) ? "E" : "";
}
type ChoiceFunc = (mat: number[][], l: number, c: number) => Direction | "";

function hasNoNeighbours(mat: number[][], l: number, c: number, choices: ChoiceFunc[]) {
  return choices.every(cMove => cMove(mat, l, c) !== "");
}

function proposeMove(mat: number[][], l: number, c: number, choices: ChoiceFunc[]): [number, number] | undefined {
  if (hasNoNeighbours(mat, l, c, choices)) return;

  let choice = "";
  for (let i = 0; i < choices.length; i++) {
    choice = choices[i](mat, l, c);
    if (choice !== "") break;
  }
  const mv = moveTo[choice];
  if (mv) {
    return [l + mv[0], c + mv[1]];
  }
}

export function solvePart1(rawInput: string) {
  const input = parseInput(rawInput);
  let choices: ChoiceFunc[] = [canMoveN, canMoveS, canMoveW, canMoveE];

  for (let i = 0; i < 10; i++) {
    move(input, choices);
    const ch = choices.shift();
    choices.push(ch!);
  }
  const ranges = input.map(l => [l.indexOf(1), l.lastIndexOf(1)]);
  const positions = ranges.flat().filter(x => x !== -1);
  const [left, right] = [positions.min(), positions.max()];
  const top = ranges.findIndex(r => r[0] !== -1 && r[1] !== -1);
  const bottom = ranges.length - (ranges.reverse().findIndex(r => r[0] !== -1 && r[1] !== -1) + 1);
  const cropped = subMat(input, [top, left!], right! - left! + 1, bottom - top + 1);
  const nums = cropped.flat();

  return nums.filter(x => x === 0).length;
}

const t2 = {
  ...t1,
  expected: 20,
};

function move(mat: number[][], choices: ChoiceFunc[]): number {
  expandIfNeeded(mat);
  const proposedMoves = new Map<string, [number, number][]>();
  iterateMat(mat, (n, l, c) => {
    if (n === 1) {
      const nextMove = proposeMove(mat, l, c, choices);
      if (nextMove) {
        const mKey = nextMove.toJson();
        if (!proposedMoves.has(mKey)) proposedMoves.set(mKey, []);
        proposedMoves.get(mKey)!.push([l, c]);
      }
    }
  });
  let movesDone = 0;
  proposedMoves.forEach((sources, target) => {
    if (sources.length === 1) {
      const [sl, sc] = sources[0];
      const [tl, tc] = JSON.parse(target);
      mat[sl][sc] = 0;
      mat[tl][tc] = 1;
      movesDone++;
    }
  });
  return movesDone;
}
export function solvePart2(rawInput: string) {
  const input = parseInput(rawInput);
  let choices = [canMoveN, canMoveS, canMoveW, canMoveE];
  let round = 1;
  while (move(input, choices) > 0) {
    round++;
    const ch = choices.shift();
    choices.push(ch!);
  }
  return round;
}

export const tests = [[t1], [t2]];
export const onlyTests = false;
