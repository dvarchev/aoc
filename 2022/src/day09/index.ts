import run from "aocrunner";
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
  return (
    rawInput.split("\n").map((l) => l.split(" ")) as [string, string][]
  ).map((l) => [l[0], +l[1]]);
}

const dirM: { [key: string]: [number, number] } = {
  U: [0, 1],
  D: [0, -1],
  L: [-1, 0],
  R: [1, 0],
};

function moveHead(hc: [number, number], md: string): [number, number] {
  return [hc[0] + dirM[md][0], hc[1] + dirM[md][1]];
}
function move(hca: [number, number][], md: string): [number, number][] {
  let [hh, ...rest] = hca;
  let rr = rest.reverse();
  hh = moveHead(hh, md);
  const res = [hh];
  let hc = hh;
  let tc = rr.pop()!;
  while (tc) {
    const [hx, hy] = hc,
      [tx, ty] = tc,
      dx = hx - tx,
      dy = hy - ty;
    if (Math.abs(dx) > 1 || Math.abs(dy) > 1) {
      const mx = 1 * Math.sign(dx),
        my = 1 * Math.sign(dy);
      tc = [tc[0] + mx, tc[1] + my];
    }
    res.push(tc);
    hc = tc;
    tc = rr.pop()!;
  }

  return res;
}

function moveRope(
  hc: [number, number][],
  m: [string, number],
): [[number, number][], [number, number][]] {
  const [md, mn] = m;
  const tms : [number, number][]= [];
  for (let i = 0; i < mn; i++) {
    hc = move(hc, md);
    tms.push(_.last(hc)!);
  }
  return [tms, hc];
}

function getTailMoves(moves: [string, number][], hc: [number, number][]) {
  let tms: [number, number][] = [];
  const allTMoves = new Set<string>();

  moves.forEach((m) => {
    [tms, hc] = moveRope(hc, m);

    tms.forEach((tm) => {
      allTMoves.add(tm.join(","));
    });
  });
  return allTMoves.size;
}

function solvePart1(rawInput: string) {
  const moves = parseInput(rawInput);
  let hc: [number, number][] = [
    [0, 0],
    [0, 0],
  ];
  return getTailMoves(moves, hc);
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

function solvePart2(rawInput: string) {
  const moves = parseInput(rawInput);
  let hc: [number, number][] = [
    [0, 0],
    [0, 0],
    [0, 0],
    [0, 0],
    [0, 0],
    [0, 0],
    [0, 0],
    [0, 0],
    [0, 0],
    [0, 0],
  ];

  return getTailMoves(moves, hc);
}

run({
  part1: {
    tests: [t1],
    solution: solvePart1,
  },
  part2: {
    tests: [t21, t22, t23],
    solution: solvePart2,
  },
  trimTestInputs: false,
  onlyTests: false,
});
