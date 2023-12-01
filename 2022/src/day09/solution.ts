import _ from "lodash";
import { cl } from "../utils/index.js";

const t1 = {
  input: `R 4
U 4
L 3
D 1
R 4
D 1
L 5
R 2`,
  expected: 13,
};

function parseInput(rawInput: string): [string, number][] {
  return rawInput
    .split("\n")
    .map(l => l.split(" ") as [string, string])
    .map(l => [l[0], +l[1]]);
}

const moveVectors: { [key: string]: [number, number] } = {
  U: [0, 1],
  D: [0, -1],
  L: [-1, 0],
  R: [1, 0],
};

function moveHead(head: [number, number], direction: string): [number, number] {
  return [head[0] + moveVectors[direction][0], head[1] + moveVectors[direction][1]];
}
function move(hca: [number, number][], direction: string): [number, number][] {
  let [head, ...rest] = hca;
  let rr = rest.reverse();
  head = moveHead(head, direction);
  const result = [head];
  let currentFirst = head;
  let currentSecond = rr.pop();
  while (currentSecond) {
    const [fx, fy] = currentFirst,
      [sx, sy] = currentSecond,
      dx = fx - sx,
      dy = fy - sy;
    if (Math.abs(dx) > 1 || Math.abs(dy) > 1) {
      const mx = 1 * Math.sign(dx),
        my = 1 * Math.sign(dy);
      currentSecond = [currentSecond[0] + mx, currentSecond[1] + my];
    }
    result.push(currentSecond);
    currentFirst = currentSecond;
    currentSecond = rr.pop();
  }

  return result;
}

function moveRope(rope: [number, number][], instruction: [string, number]): [[number, number][], [number, number][]] {
  let [modeDirection, nMoves] = instruction;
  const tailPositions: [number, number][] = [];
  while (nMoves > 0) {
    rope = move(rope, modeDirection);
    tailPositions.push(rope.last()!);
    nMoves--;
  }
  return [tailPositions, rope];
}

function getTailPositions(moveInstructions: [string, number][], hc: [number, number][]) {
  let tailPositions: [number, number][] = [];
  const allTailPositions = new Set<string>();

  moveInstructions.forEach(instruction => {
    [tailPositions, hc] = moveRope(hc, instruction);

    tailPositions.forEach(tm => {
      allTailPositions.add(tm.join(","));
    });
  });
  return allTailPositions.size;
}

export function solvePart1(rawInput: string) {
  const moves = parseInput(rawInput);
  let hc: [number, number][] = Array.times(2, () => [0, 0]);

  return getTailPositions(moves, hc);
}

const t21 = {
  ...t1,
  expected: 1,
};

const t22 = {
  input: `R 5
U 8`,
  expected: 1,
};

const t23 = {
  input: `R 5
U 8
L 8
D 3
R 17
D 10
L 25
U 20`,
  expected: 36,
};

export function solvePart2(rawInput: string) {
  const moves = parseInput(rawInput);
  let hc: [number, number][] = Array.times(10, () => [0, 0]);

  return getTailPositions(moves, hc);
}

export const tests = [[t1], [t21, t22, t23]];
export const onlyTests = false;
