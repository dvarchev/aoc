import _ from "lodash";
import { cl, pictureToLetters, readFile } from "../utils/index.js";

const t1 = {
  input: readFile("./test1.txt", import.meta.url),
  expected: 13140,
};

function parseInput(rawInput: string): [number, number][] {
  return rawInput
    .split("\n")
    .map(l => l.split(" "))
    .map(([s, n]) => (s === "noop" ? [1, 0] : [2, +n]));
}

function getXByCycle(input: [number, number][], maxCycle: number): number[] {
  let x = 1;
  let currentCycleIndex = 0,
    cInstrIndex = 0,
    nInstrCycleIndex = currentCycleIndex + input[cInstrIndex][0],
    nRegisterOffset = input[cInstrIndex][1];

  const result = [];
  while (currentCycleIndex < maxCycle) {
    if (currentCycleIndex === nInstrCycleIndex) {
      x += nRegisterOffset;
      cInstrIndex++;
      nInstrCycleIndex = currentCycleIndex + input[cInstrIndex][0];
      nRegisterOffset = input[cInstrIndex][1];
    }
    result.push(x);
    currentCycleIndex++;
  }
  return result;
}

export function solvePart1(rawInput: string) {
  const input = parseInput(rawInput);
  const cycles = [20, 60, 100, 140, 180, 220];
  const registerByCycles = getXByCycle(input, 220);
  const vals = cycles.map(c => c * registerByCycles[c - 1]);
  return _.sum(vals);
}

const t2 = {
  ...t1,
  expected: "",
};

export function solvePart2(rawInput: string) {
  const input = parseInput(rawInput);
  const pixelsIndexes: number[][] = Array.times(240).chunk(40) as number[][];
  const registerByCycles = getXByCycle(input, 240);

  const pixels = pixelsIndexes.map(pRow =>
    pRow.map(pi => {
      const x = registerByCycles[pi];
      const li = pi % 40;
      if (li >= x - 1 && li <= x + 1) return "#";
      return ".";
    }),
  );

  const result = pictureToLetters(pixels);
  return result;
}
export const tests = [[t1], [t2]];
export const onlyTests = false;
