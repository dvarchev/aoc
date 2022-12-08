import run from "aocrunner";
import _ from "lodash";
import { cl } from "../utils/index.js";

const t1 = {
  input: `$ cd /
$ ls
dir a
14848514 b.txt
8504156 c.dat
dir d
$ cd a
$ ls
dir e
29116 f
2557 g
62596 h.lst
$ cd e
$ ls
584 i
$ cd ..
$ cd ..
$ cd d
$ ls
4060174 j
8033020 d.log
5626152 d.ext
7214296 k`,
  expected: 95437,
};
class Dir {
  name: string;
  parent: Dir | undefined;
  files: { [x: string]: number };
  dirs: { [x: string]: Dir };
  private size: number | undefined;

  constructor(name: string, parent?: Dir) {
    this.name = name;
    this.parent = parent;
    this.files = {};
    this.dirs = {};
  }
  addDir(name: string) {
    if (!this.dirs[name]) {
      const dir = new Dir(name, this);
      this.dirs[name] = dir;
      return dir;
    }
  }
  addEntry([param, name]: [string, string, string?]) {
    if (param === "dir") return this.addDir(name);
    else this.files[name] = +param;
  }
  getSize(): number {
    if (this.size === undefined) {
      this.size =
        _(this.files).values().sum() +
        _(this.dirs)
          .values()
          .map((d) => d.getSize())
          .sum();
    }
    return this.size;
  }
}

function parseInput(rawInput: string) {
  const $root: Dir = new Dir("$root");
  let currentDir: Dir = $root;
  const allDirs = [$root];
  const commands: [string, string, string?][] = rawInput
    .split("\n")
    .map((l) => l.split(" ") as [string, string, string?])
    .reverse();
  const processLs = () => {
    let lsLine = commands.pop();
    while (lsLine && lsLine[0] !== "$") {
      const dir = currentDir.addEntry(lsLine);
      if (dir) allDirs.push(dir);
      lsLine = commands.pop();
    }
    if (lsLine) commands.push(lsLine);
  };
  const processCd = (path: string) => {
    if (path === "/") currentDir = $root;
    else if (path === "..") currentDir = currentDir.parent!;
    else currentDir = currentDir!.dirs[path];
  };
  const processCommand = (cmd: [string, string, string?]) => {
    if (cmd[1] === "cd") processCd(cmd[2]!);
    else processLs();
  };

  // Skip firts cmd (always cd /)
  commands.pop();
  let currentCommand = commands.pop();
  while (currentCommand) {
    processCommand(currentCommand);
    currentCommand = commands.pop();
  }
  return allDirs;
}

function solvePart1(rawInput: string) {
  const allDirs = parseInput(rawInput);

  const sum = _.sum(
    allDirs.filter((d) => d.getSize() <= 100000).map((d) => d.size),
  );
  return sum;
}

const t2 = {
  ...t1,
  expected: 24933642,
};

function solvePart2(rawInput: string) {
  const allDirs = parseInput(rawInput);
  allDirs.forEach((d) => d.getSize());
  const total = 70000000;
  const sdirs = allDirs.sort((d1, d2) => d1.getSize() - d2.getSize());
  const used = _.last(sdirs)!.getSize();
  const free = total - used;
  const needed = 30000000 - free;
  const dir = sdirs.find((d) => d.getSize() > needed);
  return dir!.getSize();
}

run({
  part1: {
    tests: [t1],
    solution: solvePart1,
  },

  part2: {
    tests: [t2],
    solution: solvePart2,
  },
  trimTestInputs: false,
  onlyTests: false,
});
