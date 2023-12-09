import { Config, cl, clm, matrix, matrixN } from "aoc-utils";

const t1 = {
  input: `>>><<><>><<<>><>>><<<>>><<<><<<>><>><<>>`,
  expected: 3068,
};

const rockPatterns = `####

.#.
###
.#.

..#
..#
###

#
#
#
#

##
##`;
function parseInput(rawInput: string): { jetMoves: string[]; rocks: number[][][] } {
  const jetMoves = rawInput.split("");
  const rocks = rockPatterns
    .replaceAll(".", "0")
    .replaceAll("#", "1")
    .split("\n\n")
    .map(r => r.split("\n").map(l => l.split("").map(n => +n)));
  return { jetMoves, rocks };
}
function runGame(state: { board: number[][]; top: number }, jetMoves: string[], rocks: number[][][], rounds: number) {
  let round = 1;
  const moves = [];
  let { board, top } = state;
  let currentRockIndex = 0;
  let currentJetIndex = 0;
  while (round <= rounds) {
    const rock = rocks[currentRockIndex];
    const tl: [number, number] = [top + 2 + rock.length, 2];
    const br: [number, number] = [tl[0] - rock.length + 1, tl[1] + rock[0].length - 1];
    const rockPos: [[number, number], [number, number]] = [tl, br];

    const isIn = (nc: number): boolean => nc < 7 && nc >= 0;

    const canMoveSide = (pos: [[number, number], [number, number]], move: number): boolean => {
      const [tl, br] = pos;
      const np = [
        [tl[0], tl[1] + move],
        [br[0], br[1] + move],
      ];
      const [ntl, nbr] = np;
      for (let i = ntl[0]; i >= nbr[0]; i--)
        for (let j = ntl[1]; j <= nbr[1]; j++) {
          const ri = ntl[0] - i;
          const rj = j - ntl[1];
          if (board[i][j] && rock[ri][rj]) return false;
        }
      return true;
    };

    const shiftRock = (p: [[number, number], [number, number]], move: number): [[number, number], [number, number]] => {
      move = isIn(p[0][1] + move) && isIn(p[1][1] + move) && canMoveSide(p, move) ? move : 0;
      return [
        [p[0][0], p[0][1] + move],
        [p[1][0], p[1][1] + move],
      ];
    };
    const canMoveDownRock = (pos: [[number, number], [number, number]]): boolean => {
      const [tl, br] = pos;
      const np = [
        [tl[0] - 1, tl[1]],
        [br[0] - 1, br[1]],
      ];
      const [ntl, nbr] = np;
      if (nbr[0] < 0) return false;
      for (let i = ntl[0]; i >= nbr[0]; i--)
        for (let j = ntl[1]; j <= nbr[1]; j++) {
          const ri = ntl[0] - i;
          const rj = j - ntl[1];
          if (board[i][j] && rock[ri][rj]) return false;
        }
      return true;
    };
    while (true) {
      const currentJet = jetMoves[currentJetIndex];
      const move = currentJet === ">" ? 1 : -1;
      const newRockPos = shiftRock(rockPos, move);
      currentJetIndex = (currentJetIndex + 1) % jetMoves.length;
      rockPos[0] = newRockPos[0];
      rockPos[1] = newRockPos[1];
      if (canMoveDownRock(newRockPos)) {
        rockPos[0][0]--;
        rockPos[1][0]--;
      } else {
        moves.push([currentRockIndex, rockPos[0][0], rockPos[0][1]]);
        break;
      }
    }

    top = Math.max(rockPos[0][0] + 1, top);

    const [newTopLeft, newBottomRight] = rockPos;
    for (let i = newTopLeft[0]; i >= newBottomRight[0]; i--)
      for (let j = newTopLeft[1]; j <= newBottomRight[1]; j++) {
        const ri = newTopLeft[0] - i;
        const rj = j - newTopLeft[1];
        board[i][j] = board[i][j] || rock[ri][rj] ? 1 : 0;
      }

    currentRockIndex = (currentRockIndex + 1) % rocks.length;
    round++;
  }
  state.top = top;
  return moves;
}
export function solvePart1(rawInput: string) {
  const { jetMoves, rocks } = parseInput(rawInput);
  const rounds = 2022;
  const state: { board: number[][]; top: number } = {
    board: matrixN(rounds * 3 + 10, 7),
    top: 0,
  };
  runGame(state, jetMoves, rocks, rounds);
  // clm(state.board,'.#',[0,0],[20,7]);
  return state.top;
}

const t2 = {
  ...t1,
  expected: 1514285714288,
};

function findLoop(rounds: number, moves: number[][]) {
  let maxLength = 1,
    lStart = 0,
    lLength = 0;
  for (let i = 0; i < rounds - 1; i++) {
    for (let j = i + maxLength + 1; j < rounds; j++) {
      let first = i,
        second = j;
      while (second < rounds) {
        if (moves[first][0] !== moves[second][0] || moves[first][2] !== moves[second][2]) break;
        first++;
        second++;
      }
      if (first - i > maxLength) {
        maxLength = first - i;
        lStart = i;
        lLength = j - i;
      }
    }
  }
  return { start: lStart, length: lLength };
}
export function solvePart2(rawInput: string) {
  const { jetMoves, rocks } = parseInput(rawInput);
  let rounds = 10000; // Find max cycle after first 10K rounds
  const state: { board: number[][]; top: number } = {
    board: matrixN(rounds * 3 + 10, 7),
    top: 0,
  };
  const moves = runGame(state, jetMoves, rocks, rounds);
  let { start, length } = findLoop(rounds, moves);
  const loopStart = moves[start - 1][1] + 1;
  const linesInStart = loopStart;
  const loopEnd = moves[start + length - 1][1] + 1;
  const linesInLoop = loopEnd - linesInStart;
  const loops = Math.floor((1000000000000 - start) / length);
  const rocksInLoops = loops * length;
  const rocksAfterLoops = 1000000000000 - start - rocksInLoops;
  const afterLoopEnd = moves[start + length + rocksAfterLoops][1] + 1;
  const linesAfterLoop = afterLoopEnd - linesInLoop - linesInStart - 1;
  return linesInStart + linesInLoop * loops + linesAfterLoop;
}

export const tests = [[t1], [t2]];
export const config: Config = {
  onlyTests: false,
};
