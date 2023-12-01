import { cl, clm, matrix } from "../utils/index.js";

const t1 = {
  input: `        ...#
        .#..
        #...
        ....
...#.......#
........#...
..#....#....
..........#.
        ...#....
        .....#..
        .#......
        ......#.

10R5L5R10L4R5L5`,
  expected: 6032,
};

type Rotation = "R" | "L";
type Direction = "D" | "L" | "U" | "R";
type Point = [number, number];

function parseInput(rawInput: string): { board: number[][]; instructions: [number, Rotation?][] } {
  const [boardLines, instructionLine] = rawInput.split("\n\n");
  const board = boardLines
    .replaceAll(" ", "0")
    .replaceAll(".", "1")
    .replaceAll("#", "2")
    .split("\n")
    .map(l => l.split("").map(n => +n));
  const maxLenght: number = board.map(l => l.length).max();
  board.forEach(l => l.push(...Array.times(maxLenght - l.length, () => 0)));

  const instructions = instructionLine
    .replaceAll("R", " R,")
    .replaceAll("L", " L,")
    .split(",")
    .map(ins => ins.split(" "))
    .map(([i1, i2]) => [+i1, i2]) as [number, Rotation?][];
  return { board, instructions };
}
const directionValues: { [key in Direction]: number } = {
  R: 0,
  D: 1,
  L: 2,
  U: 3,
};

const rotations: { [key in Rotation]: { [key in Direction]: Direction } } = {
  L: {
    R: "U",
    D: "R",
    L: "D",
    U: "L",
  },
  R: {
    R: "D",
    D: "L",
    L: "U",
    U: "R",
  },
};

const nextPosOffsets: { [key in Direction]: Point } = {
  R: [0, 1],
  D: [1, 0],
  L: [0, -1],
  U: [-1, 0],
};

export function solvePart1(rawInput: string) {
  const input = parseInput(rawInput);
  const { board, instructions } = input;
  const width = board[0].length;
  const height = board.length;
  const startPos: [number, number] = [0, board[0].indexOf(1)],
    startDir: Direction = "R";
  let currentPos = startPos,
    currentDir: Direction = startDir;

  function getNextPos(currentPos: [number, number]): [number, number] {
    const offset = nextPosOffsets[currentDir];

    let nextPos: [number, number] = [(currentPos[0] + offset[0]) % height, (currentPos[1] + offset[1]) % width];
    if (nextPos[0] < 0) nextPos[0] = height - 1;
    if (nextPos[1] < 0) nextPos[1] = width - 1;
    return nextPos;
  }
  const move = () => {
    let nextPos = getNextPos(currentPos);
    let [nl, nc] = nextPos;
    while (board[nl][nc] === 0) {
      nextPos = getNextPos(nextPos);
      [nl, nc] = nextPos;
    }
    if (board[nl][nc] === 2) return false;
    currentPos = nextPos;
    return true;
  };

  instructions.forEach(([step, rot]: [number, Rotation?]) => {
    Array.times(step, () => {
      move();
    });
    if (rot) currentDir = rotations[rot][currentDir] as Direction;
  });
  return 1000 * (currentPos[0] + 1) + 4 * (currentPos[1] + 1) + directionValues[currentDir];
}

const t2 = {
  ...t1,
  expected: 5031,
};

function apply(mat: number[][], target: number[][], [px, py]: [number, number]) {
  for (let i = 0; i < mat.length; i++) {
    for (let j = 0; j < mat[0].length; j++) target[px + i][py + j] = mat[i][j];
  }
}

function rotateMat(mat: number[][], times: number): number[][] {
  let newMat: number[][];
  for (let t = 0; t < times; t++) {
    newMat = matrix(mat.length, mat.length);

    for (let i = 0; i < mat.length; i++)
      for (let j = 0; j < mat.length; j++) newMat[j][mat.length - (i + 1)] = mat[i][j];
    mat = newMat;
  }
  return newMat!;
}
function subMat(mat: number[][], [sx, sy]: [number, number], width: number, height: number): number[][] {
  const res = matrix(height, width);

  for (let i = 0; i < height; i++) {
    for (let j = 0; j < width; j++) res[i][j] = mat[sx + i][sy + j];
  }
  return res;
}

function fixBoard(board: number[][], side: number): number[][] {
  if (side < 10) return board;

  const fixedBoard = matrix(side * 3, side * 4);
  let start: [number, number] = [0, board[0].indexOf(1)];

  const mat1 = subMat(board, start, side, side);
  apply(mat1, fixedBoard, [0, side * 2]);

  let mat6 = subMat(board, [start[0], start[1] + side], side, side);
  mat6 = rotateMat(mat6, 2);
  apply(mat6, fixedBoard, [side * 2, side * 3]);

  let mat4 = subMat(board, [start[0] + side, start[1]], side, side);
  apply(mat4, fixedBoard, [side, side * 2]);

  let mat5 = subMat(board, [start[0] + side * 2, start[1]], side, side);
  apply(mat5, fixedBoard, [side * 2, side * 2]);

  let mat3 = subMat(board, [start[0] + side * 2, 0], side, side);
  mat3 = rotateMat(mat3, 1);
  apply(mat3, fixedBoard, [side, side]);

  let mat2 = subMat(board, [start[0] + side * 3, 0], side, side);
  mat2 = rotateMat(mat2, 1);
  apply(mat2, fixedBoard, [side, 0]);

  return fixedBoard;
}

export function solvePart2(rawInput: string) {
  let { board, instructions } = parseInput(rawInput);
  const non0 = board.flat().filter(n => n !== 0).length;
  const cubeSide = Math.sqrt(non0 / 6);
  board = fixBoard(board, cubeSide);
  const width = board[0].length;
  const height = board.length;

  const boardWithNumbers = [...board.map(l => [...l])];
  const sides = {
    "1": [
      [0, 2 * cubeSide],
      [cubeSide, 3 * cubeSide],
    ],
    "2": [
      [cubeSide, 0],
      [cubeSide * 2, cubeSide],
    ],
    "3": [
      [cubeSide, cubeSide],
      [cubeSide * 2, cubeSide * 2],
    ],
    "4": [
      [cubeSide, cubeSide * 2],
      [cubeSide * 2, cubeSide * 3],
    ],
    "5": [
      [cubeSide * 2, cubeSide * 2],
      [cubeSide * 3, cubeSide * 3],
    ],
    "6": [
      [cubeSide * 2, cubeSide * 3],
      [cubeSide * 3, cubeSide * 4],
    ],
  };
  Object.entries(sides).forEach(([key, [tl, br]]) => {
    for (let i = tl[0]; i < br[0]; i++) for (let j = tl[1]; j < br[1]; j++) boardWithNumbers[i][j] = +key;
  });

  const transitionDirections: { [key: string]: Direction } = {
    "1R": "L",
    "1D": "D",
    "1L": "D",
    "1U": "D",
    "2U": "D",
    "2R": "R",
    "2D": "U",
    "2L": "U",
    "3L": "L",
    "3R": "R",
    "3U": "R",
    "3D": "R",
    "4L": "L",
    "4U": "U",
    "4D": "D",
    "4R": "D",
    "5U": "U",
    "5R": "R",
    "5L": "U",
    "5D": "U",
    "6L": "L",
    "6U": "L",
    "6R": "L",
    "6D": "R",
  };
  const posChanges: { [key: string]: any } = {
    "4D": [1, 0],
    "4L": [0, -1],
    "4U": [-1, 0],
    "4R": (x: number, y: number) => [sides["6"][0][0], sides["6"][0][1] + sides["4"][1][0] - (x + 1)],
    "1D": [1, 0],
    "1L": (x: number, y: number) => [sides["3"][0][0], sides["3"][0][1] + (x - sides["1"][0][0])],
    "1U": (x: number, y: number) => [sides["2"][0][0], sides["2"][0][1] + (sides["1"][1][1] - (y + 1))],
    "1R": (x: number, y: number) => [sides["6"][0][0] + sides["1"][1][0] - (x + 1), sides["6"][1][1] - 1],
    "2D": (x: number, y: number) => [sides["5"][1][0] - 1, sides["5"][0][1] + (sides["2"][1][1] - (y + 1))],
    "2L": (x: number, y: number) => [sides["6"][1][0] - 1, sides["6"][0][1] + sides["2"][1][0] - (x + 1)],
    "2U": (x: number, y: number) => [0, sides["1"][0][1] + sides["2"][1][1] - (y + 1)],
    "2R": [0, 1],
    "3D": (x: number, y: number) => [sides["5"][0][0] + (sides["3"][1][1] - (y + 1)), sides["5"][0][1]],
    "3L": [0, -1],
    "3U": (x: number, y: number) => [sides["1"][0][0] + y - sides["3"][0][1], sides["1"][0][1]],
    "3R": [0, 1],
    "5D": (x: number, y: number) => [sides["2"][1][0] - 1, sides["2"][0][1] + (sides["5"][1][1] - (y + 1))],
    "5L": (x: number, y: number) => [sides["3"][1][0] - 1, sides["3"][0][1] + (sides["5"][1][0] - (x + 1))],
    "5U": [-1, 0],
    "5R": [0, 1],
    "6D": (x: number, y: number) => [sides["2"][0][0] + (sides["6"][1][1] - (y + 1)), sides["2"][0][1]],
    "6L": [0, -1],
    "6U": (x: number, y: number) => [sides["4"][0][0] + (sides["6"][1][1] - (y + 1)), sides["4"][1][1] - 1],
    "6R": (x: number, y: number) => [sides["1"][0][0] + (sides["6"][1][0] - (x + 1)), sides["1"][1][1] - 1],
  };
  const startPos: [number, number] = [0, board[0].indexOf(1)],
    startDir: Direction = "R";
  let currentPos = startPos,
    currentDir: Direction = startDir;

  function getNextPos(pos: [number, number]): [number, number] {
    const offset = nextPosOffsets[currentDir];
    let nextPos: [number, number] = [(pos[0] + offset[0]) % height, (pos[1] + offset[1]) % width];
    if (nextPos[0] < 0) nextPos[0] = height - 1;
    if (nextPos[1] < 0) nextPos[1] = width - 1;
    return nextPos;
  }
  const move = () => {
    const [cx, cy] = currentPos;
    board[cx][cy] = 3 + directionValues[currentDir];
    let nextPos = getNextPos(currentPos);
    let nextDir = currentDir;
    const [nx, ny] = nextPos;
    const currSide = boardWithNumbers[cx][cy];
    const nextSide = boardWithNumbers[nx][ny];
    if (currSide !== nextSide) {
      const transKey = `${currSide}${currentDir}`;
      const trans: any = posChanges[transKey];
      if (Array.isArray(trans)) {
        nextPos = [currentPos[0] + trans[0], currentPos[1] + trans[1]];
      } else if (typeof trans === "function") {
        nextPos = trans(...currentPos);
      }
      nextDir = transitionDirections[transKey];
    }
    let [nl, nc] = nextPos;
    if (board[nl][nc] === 2) return false;
    currentPos = nextPos;
    currentDir = nextDir;
    return true;
  };

  instructions.forEach(([step, rot]: [number, Rotation?]) => {
    Array.times(step, () => {
      move();
    });
    if (rot) currentDir = rotations[rot][currentDir] as Direction;
  });

  if (cubeSide < 10) return 1000 * (currentPos[0] + 1) + 4 * (currentPos[1] + 1) + directionValues[currentDir];

  const relx = currentPos[0] % cubeSide;
  const rely = currentPos[1] % cubeSide;
  const origRelX = cubeSide - (relx + 1);
  const origRelY = cubeSide - (rely + 1);
  const origX = origRelX;
  const origY = cubeSide * 2 + origRelY;
  const dirFlip: { [key in Direction]: Direction } = {
    L: "R",
    R: "L",
    U: "D",
    D: "U",
  };
  return 1000 * (origX + 1) + 4 * (origY + 1) + directionValues[dirFlip[currentDir]];
}

export const tests = [[t1], [t2]];
export const onlyTests = false;
