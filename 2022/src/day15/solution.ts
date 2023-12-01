import { cl, cmc } from "../utils/index.js";

const t1 = {
  input: `Sensor at x=2, y=18: closest beacon is at x=-2, y=15
Sensor at x=9, y=16: closest beacon is at x=10, y=16
Sensor at x=13, y=2: closest beacon is at x=15, y=3
Sensor at x=12, y=14: closest beacon is at x=10, y=16
Sensor at x=10, y=20: closest beacon is at x=10, y=16
Sensor at x=14, y=17: closest beacon is at x=10, y=16
Sensor at x=8, y=7: closest beacon is at x=2, y=10
Sensor at x=2, y=0: closest beacon is at x=2, y=10
Sensor at x=0, y=11: closest beacon is at x=2, y=10
Sensor at x=20, y=14: closest beacon is at x=25, y=17
Sensor at x=17, y=20: closest beacon is at x=21, y=22
Sensor at x=16, y=7: closest beacon is at x=15, y=3
Sensor at x=14, y=3: closest beacon is at x=15, y=3
Sensor at x=20, y=1: closest beacon is at x=15, y=3`,
  expected: 26,
};

function parseInput(rawInput: string): [[number, number], [number, number]][] {
  return rawInput.split("\n").map(
    l =>
      l
        .replace("Sensor at x=", "")
        .replaceAll(" y=", "")
        .replace(": closest beacon is at x=", "->")
        .split("->")
        .map(p => p.split(",").map(n => +n)) as [[number, number], [number, number]],
  );
}
function manDist(p1: [number, number], p2: [number, number]): number {
  return Math.abs(p1[0] - p2[0]) + Math.abs(p1[1] - p2[1]);
}

function getIntersectionWith(input: number[][][], manDists: number[], y: number): [number, number][] {
  return input
    .map(([[sx, sy]], i) => {
      const md = manDists[i];
      if (sy + md >= y && sy - md <= y) {
        const dy = Math.abs(y - sy);
        const dx = md - dy;
        return [sx - dx, sx + dx];
      }
    })
    .filter(ip => ip) as [number, number][];
}

export function solvePart1(rawInput: string) {
  const input = parseInput(rawInput);
  const manDists = input.map(l => manDist(...l));

  const y = input.length < 20 ? 10 : 2000000;
  const intersections = getIntersectionWith(input, manDists, y);

  const mergedSegments = mergeOverlappingSegments(intersections);
  const lengths = mergedSegments.map(([c1, c2]) => c2 - c1 + 1);
  const beaconsAtY = input.filter(([_s, [_bx, by]]) => by === y).map(([_s, [bx, by]]) => `${bx},${by}`).unique();
  const totalLength = lengths.sum();
  return totalLength - beaconsAtY.length;
}

const t2 = {
  ...t1,
  expected: 56000011,
};

function mergeOverlappingSegments(intersections: [number, number][]) {
  const sorted = intersections.sort((a, b) => a[0] - b[0]);
  const mergedSegments = [];
  let i = 1;
  let current = sorted[0];
  while (i < sorted.length) {
    const next = sorted[i];
    if (next[0] - 1 <= current[1]) current[1] = Math.max(next[1], current[1]);
    else {
      mergedSegments.push(current);
      current = next;
    }
    i++;
  }
  mergedSegments.push(current);
  return mergedSegments;
}

export function solvePart2(rawInput: string) {
  const input = parseInput(rawInput);
  const manDists = input.map(l => manDist(...l));
  const maxOffset = input.length < 20 ? 20 : 4000000;
  for (let y = 0; y <= maxOffset; y++) {
    if (y && y % 10_000 === 0) {
      cl(`Scanned: ${Math.floor((y / maxOffset) * 100)}%`);
      cmc(-1, 0);
    }
    const intersections = getIntersectionWith(input, manDists, y);

    const mergedSegments = mergeOverlappingSegments(intersections);
    if (mergedSegments.length > 1) return (mergedSegments[0][1] + 1) * 4000000 + y;
  }
}

export const tests = [[t1], [t2]];
export const onlyTests = false;
