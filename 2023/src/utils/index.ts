import fs from "fs";
import { fileURLToPath } from "node:url";
import { polyfill } from "./polyfill.js";

export * from "./graph.js";
export * from "./point.js";
export const cl = console.log;
export const cmc = (lines: number = -1, columns: number = 0) => process.stdout.moveCursor(columns, lines);

polyfill();

export function sleep(milliseconds: number): void {
  const date = Date.now();
  let currentDate: number;
  do {
    currentDate = Date.now();
  } while (currentDate - date < milliseconds);
}

export function readFile(path: string, currentFile: string): string {
  const filePath = fileURLToPath(new URL(path, currentFile)).replace("/dist/", "/src/");
  return fs.readFileSync(filePath, { encoding: "utf8" });
}

export const OCR_LETTERS: any = {
  ".##.\n#..#\n#..#\n####\n#..#\n#..#": "A",
  "###.\n#..#\n###.\n#..#\n#..#\n###.": "B",
  ".##.\n#..#\n#...\n#...\n#..#\n.##.": "C",
  "####\n#...\n###.\n#...\n#...\n####": "E",
  "####\n#...\n###.\n#...\n#...\n#...": "F",
  ".##.\n#..#\n#...\n#.##\n#..#\n.###": "G",
  "#..#\n#..#\n####\n#..#\n#..#\n#..#": "H",
  ".###\n..#.\n..#.\n..#.\n..#.\n.###": "I",
  "..##\n...#\n...#\n...#\n#..#\n.##.": "J",
  "#..#\n#.#.\n##..\n#.#.\n#.#.\n#..#": "K",
  "#...\n#...\n#...\n#...\n#...\n####": "L",
  ".##.\n#..#\n#..#\n#..#\n#..#\n.##.": "O",
  "###.\n#..#\n#..#\n###.\n#...\n#...": "P",
  "###.\n#..#\n#..#\n###.\n#.#.\n#..#": "R",
  ".###\n#...\n#...\n.##.\n...#\n###.": "S",
  "#..#\n#..#\n#..#\n#..#\n#..#\n.##.": "U",
  "#...\n#...\n.#.#\n..#.\n..#.\n..#.": "Y",
  "####\n...#\n..#.\n.#..\n#...\n####": "Z",
};

export const charMap: { [key: string]: number } = {};
[...Array.times(26, i => "a".charCodeAt(0) + i), ...Array.times(26, i => "A".charCodeAt(0) + i)]
  .map((c): [string, number] => [String.fromCharCode(c), c])
  .reduce((obj, [ch, code]) => {
    obj[ch] = code;
    return obj;
  }, charMap);

export function isDigit(symbol: string | undefined): boolean {
  if (symbol === undefined || symbol.length !== 1) {
      return false;
  }
  
  const charCode = symbol.charCodeAt(0);
  return charCode >= 48 && charCode <= 57;
}

export function pictureToLetters(pixels: ("#" | ".")[][]) {
  const byLetters = pixels.map(x =>
    x
      .chunk(5)
      .map(c => c.slice(0, 4))
      .map(c => c.join("")),
  );
  const lettersTexts = byLetters[0].map((_c, i) => byLetters.map(ll => ll[i]).join("\n"));

  const result = lettersTexts.map(l => OCR_LETTERS[l]).join("");
  return result;
}

export function clm(
  mat: number[][],
  replacements?: string,
  startParam?: [number, number],
  endParam?: [number, number],
) {
  const start = startParam || [0, 0];
  const end = endParam || [mat.length, mat[0].length];
  const mapChar = (n: number) => (replacements && replacements[n]) || n;
  const toPrint = mat.slice(start[0], end[0]).map(l => l.slice(start[1], end[1]));
  cl(toPrint.map(l => l.map(n => mapChar(n)).join("")).join("\n"));
}

export function matrix<T>(linesValue: number, columnsValue: number, defaultVal: T): T[][] {
  return Array.times(linesValue, () => [...Array.times(columnsValue, () => defaultVal)]);
}
export function matrixN(linesValue: number, columnsValue: number, defaultVal: number = 0): number[][] {
  return matrix(linesValue, columnsValue, defaultVal);
}

export function matrixFromString(input: string) {
  return input.split("\n").map(l => l.split(""));
}

export function iterateMat<T>(mat: T[][], visit: (n: T, l: number, c: number) => void) {
  for (let i = 0; i < mat.length; i++) {
    for (let j = 0; j < mat[i].length; j++) {
      visit(mat[i][j], i, j);
    }
  }
}

export function subMat(
  mat: number[][],
  [sx, sy]: [number, number] = [0, 0],
  width?: number,
  height?: number,
): number[][] {
  height = height === undefined ? mat.length : height;
  width = width === undefined ? mat[0].length : width;
  const res = matrixN(height, width);

  for (let i = 0; i < height; i++) {
    for (let j = 0; j < width; j++) res[i][j] = mat[sx + i][sy + j];
  }
  return res;
}

export function getNeighbours<T>(mat: T[][], i: number, j: number): [T, number, number][] {
  const result: [T, number, number][] = [];
  for (let ci = i - 1; ci <= i + 1; ci++) {
    for (let cj = j - 1; cj <= j + 1; cj++) {
      if (isWithinMatrix(mat, ci, cj) && (ci !== i || cj !== j)) result.push([mat[ci][cj], ci, cj]);
    }
  }
  return result;
}

export function isWithinMatrix<T>(mat: T[][], i: number, j: number) {
  return i >= 0 && i< mat.length && j >= 0 && j < mat[0].length;
}
