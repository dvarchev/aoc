/**
 * This file contains utility functions and constants for AoC (Advent of Code) challenges.
 *
 * @module aoc-utils
 */

import fs from "fs";
import { fileURLToPath } from "node:url";
import { polyfill } from "./polyfill";
import run from "aocrunner";

export { run };
export * from "./polyfill";
export * from "./graph";
export * from "./point";

export const cl = console.log;
polyfill();
/**
 * Function to move the cursor in the console.
 *
 * @param lines - The number of lines to move the cursor. Default is -1.
 * @param columns - The number of columns to move the cursor. Default is 0.
 */
export const cmc = (lines: number = -1, columns: number = 0) => process.stdout.moveCursor(columns, lines);

/**
 * Function to sleep for a specified number of milliseconds.
 *
 * @param milliseconds - The number of milliseconds to sleep.
 */
export function sleep(milliseconds: number): void {
  const date = Date.now();
  let currentDate: number;
  do {
    currentDate = Date.now();
  } while (currentDate - date < milliseconds);
}

/**
 * Function to read a file and return its content as a string.
 *
 * @param path - The path of the file to read.
 * @param currentFile - The path of the current file.
 * @returns The content of the file as a string.
 */
export function readFile(path: string, currentFile: string): string {
  const filePath = fileURLToPath(new URL(path, currentFile)).replace("/dist/", "/src/");
  return fs.readFileSync(filePath, { encoding: "utf8" });
}

/**
 * Object that maps OCR letters to their corresponding characters.
 */
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

/**
 * Object that maps characters to their corresponding ASCII codes.
 */
export const charMap: { [key: string]: number } = {};
[...Array.times(26, i => "a".charCodeAt(0) + i), ...Array.times(26, i => "A".charCodeAt(0) + i)]
  .map((c): [string, number] => [String.fromCharCode(c), c])
  .reduce((obj, [ch, code]) => {
    obj[ch] = code;
    return obj;
  }, charMap);

/**
 * Function to check if a symbol is a digit.
 *
 * @param symbol - The symbol to check.
 * @returns `true` if the symbol is a digit, `false` otherwise.
 */
export function isDigit(symbol: string | undefined): boolean {
  if (symbol === undefined || symbol.length !== 1) {
    return false;
  }

  const charCode = symbol.charCodeAt(0);
  return charCode >= 48 && charCode <= 57;
}

/**
 * Function to convert a picture represented by a 2D array of pixels to a string of letters.
 *
 * @param pixels - The 2D array of pixels representing the picture.
 * @returns The string of letters corresponding to the picture.
 */
export function pictureToLetters(pixels: ("#" | ".")[][]): string {
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

/**
 * Function to print a matrix with optional replacements for values and optional start and end positions.
 *
 * @param mat - The matrix to print.
 * @param replacements - Optional replacements for values in the matrix.
 * @param startParam - Optional start position of the sub-matrix to print.
 * @param endParam - Optional end position of the sub-matrix to print.
 */
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

/**
 * Function to create a matrix with specified dimensions and default values.
 *
 * @param linesValue - The number of lines in the matrix.
 * @param columnsValue - The number of columns in the matrix.
 * @param defaultVal - The default value for each element in the matrix. Default is `undefined`.
 * @returns The created matrix.
 */
export function matrix<T>(linesValue: number, columnsValue: number, defaultVal: T): T[][] {
  return Array.times(linesValue, () => [...Array.times(columnsValue, () => defaultVal)]);
}

/**
 * Function to create a matrix of numbers with specified dimensions and default value of 0.
 *
 * @param linesValue - The number of lines in the matrix.
 * @param columnsValue - The number of columns in the matrix.
 * @param defaultVal - The default value for each element in the matrix. Default is 0.
 * @returns The created matrix.
 */
export function matrixN(linesValue: number, columnsValue: number, defaultVal: number = 0): number[][] {
  return matrix(linesValue, columnsValue, defaultVal);
}

/**
 * Function to create a matrix from a string representation.
 *
 * @param input - The string representation of the matrix.
 * @param mapFn - Optional function to apply to each element in the matrix. If not specified, the elements will be strings.
 * @returns The created matrix.
 */
// export function matrixFromString<T>(input: string, mapFn?: (s: string) => T | string): (T | string)[][] {
//   return input.lines().map(l => l.toArray().map(mapFn || (s => s)));
// }


export function matrixFromString<T = string>(input: string, mapFn?: (s: string) => T ): T[][] {
  return input.lines().map(l => l.toArray().map(mapFn || (s => s as T)));
}


/**
 * Function to iterate over each element in a matrix and apply a visit function.
 *
 * @param mat - The matrix to iterate over.
 * @param visit - The visit function to apply to each element.
 */
export function iterateMat<T>(mat: T[][], visit: (n: T, l: number, c: number) => void) {
  for (let i = 0; i < mat.length; i++) {
    for (let j = 0; j < mat[i].length; j++) {
      visit(mat[i][j], i, j);
    }
  }
}

/**
 * Function to get the sub-matrix of a matrix.
 *
 * @param mat - The matrix to get the sub-matrix from.
 * @param sx - The starting row index of the sub-matrix. Default is 0.
 * @param sy - The starting column index of the sub-matrix. Default is 0.
 * @param width - The width of the sub-matrix. Default is the number of columns in the matrix.
 * @param height - The height of the sub-matrix. Default is the number of lines in the matrix.
 * @returns The sub-matrix.
 */
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

/**
 * Function to get the neighbors of an element in a matrix.
 *
 * @param mat - The matrix.
 * @param i - The row index of the element.
 * @param j - The column index of the element.
 * @returns An array of tuples representing the neighbors of the element, where each tuple contains the neighbor element and its coordinates.
 */
export function getNeighbours<T>(mat: T[][], i: number, j: number): [T, number, number][] {
  const result: [T, number, number][] = [];
  for (let ci = i - 1; ci <= i + 1; ci++) {
    for (let cj = j - 1; cj <= j + 1; cj++) {
      if (isWithinMatrix(mat, ci, cj) && (ci !== i || cj !== j)) result.push([mat[ci][cj], ci, cj]);
    }
  }
  return result;
}

/**
 * Function to check if a given position is within the bounds of a matrix.
 *
 * @param mat - The matrix.
 * @param i - The row index.
 * @param j - The column index.
 * @returns `true` if the position is within the matrix, `false` otherwise.
 */
export function isWithinMatrix<T>(mat: T[][], i: number, j: number) {
  return i >= 0 && i < mat.length && j >= 0 && j < mat[0].length;
}

/**
 * Configuration options for the AoC utility functions.
 */
export type Config = {
  onlyTests?: boolean;
};
