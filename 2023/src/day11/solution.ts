import { cl, clm, Config, iterateMat, matrix, matrixFromString } from "aoc-utils";
import { get } from "lodash";

const t1 = {
  input: `...#......
.......#..
#.........
..........
......#...
.#........
.........#
..........
.......#..
#...#.....`,
  expected: 374,
};

function parseInput(rawInput: string, defaultCoef = 2): [number, string[][]] {
  if (!rawInput.includes("\n\n")) rawInput = `${defaultCoef}\n\n${rawInput}`;
  const [expansionCoef, matrix] = rawInput.split("\n\n");
  const input = matrixFromString(matrix);
  return [+expansionCoef, input];
}

type Point = [number, number];
function reverseMatrix(input: string[][]) {
  const reversedInput = matrix(input[0].length, input.length, '.');
  iterateMat(input, (node, l, c) => {
    reversedInput[c][l] = node;
  });
  return reversedInput;
}

export function solvePart1(rawInput: string, defaultCoef = 2) {
  const [expansionCoef, input] = parseInput(rawInput, defaultCoef);
  const reversedInput = reverseMatrix(input);
  const getEmptyRows = (mat: string[][]) => mat.map((row, i) => row.includes("#") ? -1 : i).filter(i => i !== -1);
  const emptyRows = getEmptyRows(input);
  const emptyColumns = getEmptyRows(reversedInput);
  
  const galaxies: Point[] = [];
  iterateMat(input, (node, l, c) => {
    if (node === "#") galaxies.push([l, c]);
  });
  let result = 0;
  galaxies.forEach((galaxy, i) => {
    const restOfGalaxies = galaxies.slice(i + 1);
    restOfGalaxies.forEach(otherGalaxy => {
      const [l1, c1, l2, c2] = [...galaxy, ...otherGalaxy];
      const [ml, xl] = [l1, l2].nSort();
      const [mc, xc] = [c1, c2].nSort();
      const nEmptyRows = emptyRows.filter(r => r > ml && r < xl).length;
      const nEmptyColumns = emptyColumns.filter(c => c > mc && c < xc).length;
      const emptyRowsDistance = nEmptyRows * (expansionCoef - 1);
      const emptyColumnsDistance = nEmptyColumns * (expansionCoef - 1);
      const lDiff = xl - ml;
      const cDiff = xc - mc;

      result += lDiff + cDiff + emptyRowsDistance + emptyColumnsDistance;
    });
  });

  return result;
}

const t21 = {
  input: `10

${t1.input}`,
  expected: 1030,
};

const t22 = {
  input: `100

${t1.input}`,
  expected: 8410,
};

export function solvePart2(rawInput: string) {
  return solvePart1(rawInput, 1_000_000);
}

export const tests = [[t1], [t21, t22]];
export const config: Config = {
  onlyTests: false,
};
