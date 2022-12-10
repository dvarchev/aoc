import _ from "lodash";
import { cl, readFile } from "../utils/index.js";

const t1 = {
    input: readFile("./test1.txt", import.meta.url),
    expected: 95437,
};
class Dir {
    name: string;
    parent: Dir | undefined;
    filesSize: number = 0;
    dirs: { [x: string]: Dir } = {};
    private size: number | undefined;

    constructor(name: string, parent?: Dir) {
        this.name = name;
        this.parent = parent;
    }
    addDir(name: string): Dir | undefined {
        if (!this.dirs[name]) {
            this.dirs[name] = new Dir(name, this);
            return this.dirs[name];
        }
    }
    addEntry([param, name]: [string, string, string?]) {
        if (param === "dir") return this.addDir(name);
        else this.filesSize += +param;
    }
    getSize(): number {
        if (this.size === undefined) {
            const dirsSize = _(this.dirs)
                .map((d) => d.getSize())
                .sum();
            this.size = dirsSize + this.filesSize;
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
        if (lsLine) commands.push(lsLine); // next command
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

    let currentCommand = commands.pop();
    while (currentCommand) {
        processCommand(currentCommand);
        currentCommand = commands.pop();
    }
    return allDirs;
}

export function solvePart1(rawInput: string) {
    const allDirs = parseInput(rawInput);
    const sum = _(allDirs)
        .map((d) => d.getSize())
        .filter((s) => s <= 100000)
        .sum();
    return sum;
}

const t2 = {
    ...t1,
    expected: 24933642,
};

export function solvePart2(rawInput: string) {
    const allDirs = parseInput(rawInput);
    const total = 70000000;
    const sdirs = allDirs.sort((d1, d2) => d1.getSize() - d2.getSize());
    const used = _.last(sdirs)!.getSize();
    const free = total - used;
    const needed = 30000000 - free;
    const dir = sdirs.find((d) => d.getSize() > needed);
    return dir!.getSize();
}

export const tests = [[t1], [t2]];
export const onlyTests = false;
