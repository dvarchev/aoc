import { cl, clm, cmc, iterateMat, matrix, Point, sleep } from "../utils/index.js";

const t1 = {
  input: `#.######
#>>.<^<#
#.<..<<#
#>v.><>#
#<^v^^>#
######.#`,
  expected: 18,
};

const charMap = {
  ".": 0,
  "#": 1,
  ">": 2,
  v: 3,
  "<": 4,
  "^": 5,
};

enum BlizDirection {
  Right,
  Down,
  Left,
  Up,
}

type CharMapSymbol = keyof typeof charMap;

function parseInput(rawInput: string): number[][] {
  return rawInput
    .split("\n")
    .map(line => (line.split("") as CharMapSymbol[]).map((char: CharMapSymbol) => charMap[char]));
}

const directionIncrements: { [key in BlizDirection]: [number, number] } = {
  [BlizDirection.Right]: [1, 0],
  [BlizDirection.Down]: [0, 1],
  [BlizDirection.Left]: [-1, 0],
  [BlizDirection.Up]: [0, -1],
};

class Blizzard {
  private boardWidth: number;
  private boardHeight: number;
  public position: Point;
  private teleport(from: Point): Point {
    if (from.y === this.boardHeight - 1) return new Point(from.x, 1);
    if (from.y === 0) return new Point(from.x, this.boardHeight - 2);
    if (from.x === this.boardWidth - 1) return new Point(1, from.y);
    if (from.x === 0) return new Point(this.boardWidth - 2, from.y);
    return from;
  }
  constructor(line: number, column: number, public direction: BlizDirection, board: number[][]) {
    this.position = new Point(column, line);
    this.boardHeight = board.length;
    this.boardWidth = board[0].length;
  }
  move() {
    const increment = directionIncrements[this.direction];
    const nextPosition: Point = this.position.add(increment);
    this.position = this.teleport(nextPosition);
  }
  toString(): string {
    return `${this.position.toString()}[${this.direction}]`;
  }
}

class Game {
  private blizzards: Blizzard[] = [];
  constructor(public board: number[][]) {
    iterateMat(board, (n, l, c) => {
      if (n > 1) {
        const dir: BlizDirection = n - 2;
        const toAdd = new Blizzard(l, c, dir, board);
        this.blizzards.push(toAdd);
      }
    });
  }
  playRound() {
    iterateMat(this.board, (n, l, c) => {
      if (n >= 2) this.board[l][c] = 0;
    });
    this.blizzards.forEach(b => {
      b.move();
      const { position: p, direction } = b;
      const currentValue = this.board[p.y][p.x];
      if (currentValue < 2) {
        this.board[p.y][p.x] = direction + 2;
      } else if (currentValue < 6) {
        this.board[p.y][p.x] = 6;
      } else {
        this.board[p.y][p.x]++;
      }
    });
  }
}

const potentialNextMoves: [number, number][] = [
  [0, -1],
  [-1, 0],
  [0, 0],
  [1, 0],
  [0, 1],
];

function isValidStep(currentBoard: number[][], l: number, c: number): boolean {
  const height = currentBoard.length;
  const width = currentBoard[0].length;
  return l >= 0 && l < height && c >= 0 && c < width && currentBoard[l][c] === 0;
}

function playUntilTargetReached(startPoint: Point, endPoint: Point, game: Game) {
  let currentLocations: Point[] = [startPoint];
  let rounds = 0;
  let found = false;
  while (!found) {
    game.playRound();
    // cl(rounds);
    const currentBoard = game.board;
    const nextSteps: Point[] = [];
    const added = new Set<string>();
    while (currentLocations.length > 0) {
      const cLoc = currentLocations.shift()!;
      const nextLocations = potentialNextMoves
        .map(pm => cLoc.add(pm))
        .filter(p => isValidStep(currentBoard, p.y, p.x) && !added.has(p.toString()));
      nextLocations.forEach(p => {
        added.add(p.toString());
        if (p.equals(endPoint)) found = true;
      });
      nextSteps.push(...nextLocations);
    }
    currentLocations = nextSteps;
    rounds++;
  }
  return rounds;
}

export function solvePart1(rawInput: string) {
  const input = parseInput(rawInput);
  const height = input.length;
  const width = input[0].length;
  const game = new Game(input);
  const startPoint: Point = new Point(1, 0);
  const endPoint: Point = new Point(width - 2, height - 1);
  return playUntilTargetReached(startPoint, endPoint, game);
}

const t2 = {
  ...t1,
  expected: 54,
};

export function solvePart2(rawInput: string) {
  const input = parseInput(rawInput);
  const height = input.length;
  const width = input[0].length;
  const game = new Game(input);
  const startPoint: Point = new Point(1, 0);
  const endPoint: Point = new Point(width - 2, height - 1);
  let rounds = 0;
  rounds += playUntilTargetReached(startPoint, endPoint, game);
  rounds += playUntilTargetReached(endPoint, startPoint, game);
  rounds += playUntilTargetReached(startPoint, endPoint, game);
  return rounds;
}

export const tests = [[t1], [t2]];
export const onlyTests = false;
