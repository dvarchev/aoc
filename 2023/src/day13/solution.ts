import { transposeMat } from "aoc-utils";
import { cl, Config, iterateMat, matrix, matrixFromString } from "aoc-utils";

const t1 = {
  input: `#.##..##.
..#.##.#.
##......#
##......#
..#.##.#.
..##..##.
#.#.##.#.

#...##..#
#....#..#
..##..###
#####.##.
#####.##.
..##..###
#....#..#`,
  expected: 405,
};

function parseInput(rawInput: string) {
  return rawInput.split("\n\n").map(chart => matrixFromString(chart));
}

function isLineReflection(chart: string[][], line: number, difference: number = 0): boolean {
  if (line === chart.length - 1) return false;
  let [clIndex, rlIndex] = [line, line + 1];
  let lineDifferences = 0;
  while (clIndex >= 0 && rlIndex < chart.length) {
    const currentLine = chart[clIndex];
    const reflectionLine = chart[rlIndex];
    lineDifferences += currentLine.count((n, i) => n !== reflectionLine[i]);
    if (lineDifferences > difference) return false;
    clIndex--;
    rlIndex++;
  }
  return lineDifferences === difference;
}

function getReflectionNumbers(chart: string[][], difference = 0): number {
  const transposedChart = transposeMat(chart);
  const reflectionLines = chart.findIndex((l, i) => isLineReflection(chart, i, difference)) + 1;
  const reflectionColumns = transposedChart.findIndex((l, i) => isLineReflection(transposedChart, i, difference)) + 1;

  return 100 * reflectionLines + reflectionColumns;
}

export function solvePart1(rawInput: string, difference = 0) {
  const input = parseInput(rawInput);
  const reflections = input.map(chart => getReflectionNumbers(chart, difference));

  return reflections.sum();
}

const t2 = {
  ...t1,
  expected: 400,
};

export function solvePart2(rawInput: string) {
  return solvePart1(rawInput, 1);
}

export const tests = [[t1], [t2]];
export const config: Config = {
  onlyTests: false,
};
