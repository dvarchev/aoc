import fs from "fs";
import _ from "lodash";
import { fileURLToPath } from "node:url";

export const cl = console.log;

export function readFile(path: string, currentFile: string): string {
  const filePath = fileURLToPath(new URL(path, currentFile)).replace(
    "/dist/",
    "/src/",
  );
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
[
  ..._.times(26, (i) => "a".charCodeAt(0) + i),
  ..._.times(26, (i) => "A".charCodeAt(0) + i),
]
  .map((c): [string, number] => [String.fromCharCode(c), c])
  .reduce((obj, [ch, code]) => {
    obj[ch] = code;
    return obj;
  }, charMap);
