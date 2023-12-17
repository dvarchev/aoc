import { cl, clm, Config, isWithinMatrix, iterateMat, matrixFromString, matrixN } from "aoc-utils";
import { get } from "lodash";
type BeamPos = [[number, number], Direction];
const t1 = {
  input: `.|...\\....
|.-.\\.....
.....|-...
........|.
..........
.........\\
..../.\\\\..
.-.-/..|..
.|....-|.\\
..//.|....`,
  expected: 46,
};

enum Direction {
  Up = "up",
  Down = "down",
  Left = "left",
  Right = "right",
}

function getNextPos([x, y]: [number, number], dir: Direction): [number, number] {
  switch (dir) {
    case Direction.Up:
      return [x - 1, y];
    case Direction.Down:
      return [x + 1, y];
    case Direction.Left:
      return [x, y - 1];
    case Direction.Right:
      return [x, y + 1];
  }
}
function getNextDir(dir: Direction, currentTile: string): Direction[] {
  switch (dir) {
    case Direction.Up:
    case Direction.Down:
      if (currentTile === "|" || currentTile === ".") {
        return [dir];
      } else if (currentTile === "-") {
        return [Direction.Left, Direction.Right];
      } else if (currentTile === "\\") {
        return dir === Direction.Up ? [Direction.Left] : [Direction.Right];
      } else if (currentTile === "/") {
        return dir === Direction.Up ? [Direction.Right] : [Direction.Left];
      }
      break;
    case Direction.Left:
    case Direction.Right:
      if (currentTile === "-" || currentTile === ".") {
        return [dir];
      } else if (currentTile === "|") {
        return [Direction.Up, Direction.Down];
      } else if (currentTile === "\\") {
        return dir === Direction.Left ? [Direction.Up] : [Direction.Down];
      } else if (currentTile === "/") {
        return dir === Direction.Left ? [Direction.Down] : [Direction.Up];
      }
      break;
  }
  return [];
}

function getNextBeams([pos, dir]: BeamPos, field: string[][]): BeamPos[] {
  const nextDirs = getNextDir(dir, field[pos[0]][pos[1]]);
  const nextPosistions = nextDirs.map(nDir => getNextPos(pos, nDir));
  return nextPosistions
    .map((nPos, i): BeamPos => [nPos, nextDirs[i]])
    .filter(([nPos]) => isWithinMatrix(field, ...nPos));
}

export function solvePart1(rawInput: string, startBeam: BeamPos = [[0, 0], Direction.Right]): number {
  const input = matrixFromString(rawInput);
  const passedBy: { [key: string]: boolean } = {};
  let beams = [startBeam] as BeamPos[];
  const filledTiles = matrixN(input.length, input[0].length);
  while (beams.length > 0) {
    beams.forEach(([[l, c], dir]) => {
      filledTiles[l][c] = 1;
      passedBy[`[${l},${c}]${dir}`] = true;
    });

    beams = beams
      .map(beam => getNextBeams(beam, input))
      .flat()
      .filter(([pos, dir]) => !passedBy[`[${pos[0]},${pos[1]}]${dir}`]);
  }
  return filledTiles.flat().sum();
}

const t2 = {
  ...t1,
  expected: 51,
};

export function solvePart2(rawInput: string) {
  const lines = rawInput.lines();
  const linesLength = lines.length;
  const columnsLength = lines[0].length;
  const startLocations = [
    Array.times(columnsLength, (i): BeamPos => [[0, i], Direction.Down]),
    Array.times(columnsLength, (i): BeamPos => [[linesLength - 1, i], Direction.Up]),
    Array.times(linesLength, (i): BeamPos => [[i, 0], Direction.Right]),
    Array.times(linesLength, (i): BeamPos => [[i, columnsLength - 1], Direction.Left]),
  ].flat();
  return startLocations.map(loc => solvePart1(rawInput, loc)).max();
}

export const tests = [[t1], [t2]];
export const config: Config = {
  onlyTests: false,
};
