import { result } from "lodash";
import { cl } from "../utils/index.js";

const t1 = {
  input: `seeds: 79 14 55 13

seed-to-soil map:
50 98 2
52 50 48

soil-to-fertilizer map:
0 15 37
37 52 2
39 0 15

fertilizer-to-water map:
49 53 8
0 11 42
42 0 7
57 7 4

water-to-light map:
88 18 7
18 25 70

light-to-temperature map:
45 77 23
81 45 19
68 64 13

temperature-to-humidity map:
0 69 1
1 0 69

humidity-to-location map:
60 56 37
56 93 4`,
  expected: 35,
};

function parseInput(rawInput: string): { seeds: number[]; maps: number[][][] } {
  const [seedLine, ...mapLines] = rawInput.split("\n\n");
  const seeds = seedLine
    .split(": ")[1]
    .split(" ")
    .map(n => +n);
  const maps = mapLines.map(lg =>
    lg
      .split("\n")
      .slice(1)
      .map(l => l.split(" ").map(n => +n)),
  );
  return { seeds, maps };
}

function isWithinRange(n: number, s: number, l: number) {
  return n >= s && n < s + l;
}

function mapToTarget(n: number, mapArrays: number[][][]): number {
  let target = n;
  mapArrays.forEach(tr => {
    const range = tr.find(([d, s, l]) => isWithinRange(target, s, l));
    if (range) {
      target = range[0] + (target - range[1]);
    }
  });
  return target;
}

export function solvePart1(rawInput: string) {
  const { seeds, maps } = parseInput(rawInput);
  const targets = seeds.map(s => mapToTarget(s, maps));
  return targets.min();
}

const t2 = {
  ...t1,
  expected: 46,
};

function splitSegment([segS, segL]: [number, number], [d, s, l]: number[]): [[number, number][], boolean] {
  const segE = segS + segL - 1;
  const e = s + l - 1;
  if (segE < s) return [[[segS, segL]], false];
  if (segS > e) return [[[segS, segL]], false];
  if (segS >= s && segE <= e) {
    return [[[d + segS - s, segL]], true];
  }
  if (segS < s && segE <= e) {
    const seg1L = s - segS;
    return [
      [
        [d, segL - seg1L],
        [segS, seg1L],
      ],
      true,
    ];
  }
  if (segS >= s && segE > e) {
    const seg1L = e - segS + 1;
    return [
      [
        [d + segS - s, seg1L],
        [e + 1, segL - seg1L],
      ],
      true,
    ];
  }
  // segS<s && segE >e
  const seg1L = s - segS;
  return [
    [
      [d, l],
      [segS, seg1L],
      [e + 1, segL - l - seg1L],
    ],
    true,
  ];
}

function transformSeg(segment: [number, number], transformations: number[][]): [number, number][] {
  const resultSeg: [number, number][] = [];
  const notTransf = transformations.reduce(
    (segments: [number, number][], transform: number[]): [number, number][] => {
      const redSeg: [number, number][] = [];
      segments.forEach(s => {
        const [resTr, intersects] = splitSegment(s, transform);
        if (intersects) {
          resultSeg.push(resTr[0]);
          redSeg.push(...resTr.slice(1));
        } else {
          redSeg.push(...resTr);
        }
      });
      return redSeg;
    },
    [segment],
  );
  resultSeg.push(...notTransf);
  return resultSeg;
}

function findLocations(s: number, l: number, mapArrays: number[][][]): [number, number][] {
  return mapArrays.reduce(
    (segments: [number, number][], transformations: number[][]): [number, number][] => {
      const transformed = segments.map(seg => transformSeg(seg, transformations)).flat();
      return transformed;
    },
    [[s, l]],
  );
}
export function solvePart2(rawInput: string) {
  const { seeds, maps } = parseInput(rawInput);
  const targets: [number, number][][] = [];
  for (let i = 0; i < seeds.length; i += 2) {
    const target = findLocations(seeds[i], seeds[i + 1], maps);
    targets.push(target);
  }
  return targets
    .flat()
    .map(([s]) => s)
    .min();
}

export const tests = [[t1], [t2]];
export const onlyTests = false;
