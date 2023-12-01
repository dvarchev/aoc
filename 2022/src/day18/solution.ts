import { bfs, cl } from "../utils/index.js";

const t1 = {
  input: `2,2,2
1,2,2
3,2,2
2,1,2
2,3,2
2,2,1
2,2,3
2,2,4
2,2,6
1,2,5
3,2,5
2,1,5
2,3,5`,
  expected: 64,
};

function parseInput(rawInput: string) {
  return rawInput.split("\n").map(l => l.split(",").map(n => +n));
}

const t2 = {
  ...t1,
  expected: 58,
};

function getSurfaceArea(input: number[][]) {
  const neighbours = getNeighbours(input);
  const sidesToIgnore = neighbours.map(n => n.length).sum();

  return input.length * 6 - sidesToIgnore;
}

function getNeighbours(input: number[][]) {
  const areAdj = ([ax, ay, az]: number[], [bx, by, bz]: number[]) => {
    const dx = Math.abs(ax - bx),
      dy = Math.abs(ay - by),
      dz = Math.abs(az - bz);
    return dx + dy + dz === 1;
  };
  const neighbours: number[][] = Array.times(input.length, () => []);
  for (let i = 0; i < input.length - 1; i++) {
    for (let j = i + 1; j < input.length; j++) {
      const a = input[i];
      const b = input[j];
      if (areAdj(a, b)) {
        neighbours[i].push(j);
        neighbours[j].push(i);
      }
    }
  }
  return neighbours;
}

const getKey = ([i, j, k]: number[]) => `${i},${j},${k}`;

function getNeighbourCubes([ci, cj, ck]: number[]): number[][] {
  const neighboursOffsets = [
    [1, 0, 0],
    [-1, 0, 0],
    [0, 1, 0],
    [0, -1, 0],
    [0, 0, 1],
    [0, 0, -1],
  ];
  return neighboursOffsets.map(([ni, nj, nk]) => [ci + ni, cj + nj, ck + nk]);
}
function getEnclosure(lava: { [key: string]: boolean }, min: number, max: number): number[][] {
  const cube = [0, 0, 0];
  const cubes: number[][] = [];
  const isOutsideLimits = (n: number[]) => n.some(ni => ni < min - 1 || ni > max + 1);
  bfs(
    cube,
    c => {
      const neighbours = getNeighbourCubes(c);
      return neighbours.filter(n => {
        const nk = getKey(n);
        return !lava[nk] && !isOutsideLimits(n);
      });
    },
    c => cubes.push(c),
  );
  return cubes;
}

export function solvePart1(rawInput: string) {
  const input = parseInput(rawInput);
  return getSurfaceArea(input);
}

export function solvePart2(rawInput: string) {
  const input = parseInput(rawInput);
  const inputFlat = input.flat();
  const max = inputFlat.max();
  const min = inputFlat.min();

  const lava: { [key: string]: boolean } = {};
  input.map(getKey).forEach(cs => (lava[cs] = true));

  const enclosure = getEnclosure(lava, min, max);
  const enclosureSurfaceArea = getSurfaceArea(enclosure);
  const enclosureSize = max + 1 - (min - 1) + 1;
  const enclosureOuterSurface = enclosureSize * enclosureSize * 6;
  return enclosureSurfaceArea - enclosureOuterSurface;
}

export const tests = [[t1], [t2]];
export const onlyTests = false;
