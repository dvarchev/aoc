import _ from "lodash";
import { cl } from "../utils/index.js";

const t1 = {
  input: `A Y
B X
C Z`,
  expected: 15,
};

const scores: any = {
  AX: 3,
  AY: 6,
  AZ: 0,
  BX: 0,
  BY: 3,
  BZ: 6,
  CX: 6,
  CY: 0,
  CZ: 3,
};

const mMove: any = {
  A: {
    X: "Z",
    Y: "X",
    Z: "Y",
  },
  B: {
    X: "X",
    Y: "Y",
    Z: "Z",
  },
  C: {
    X: "Y",
    Y: "Z",
    Z: "X",
  },
};

const moveScore: any = {
  X: 1,
  Y: 2,
  Z: 3,
};

function parseInput(rawInput: string): string[][] {
  return rawInput.split("\n").map((l) => l.split(" "));
}

export function solvePart1(rawInput: string) {
  const input = parseInput(rawInput);
  const moves = input.map((l) => scores[l.join("")] + moveScore[l[1]]);
  return _.sum(moves);
}

const t2 = {
  ...t1,
  expected: 12,
};

export function solvePart2(rawInput: string) {
  const input = parseInput(rawInput);
  const moves = input.map((l) => {
    const mm = mMove[l[0]][l[1]];
    return scores[l[0] + mm] + moveScore[mm];
  });

  return _.sum(moves);
}

export const tests = [[t1], [t2]];
export const onlyTests = false;
