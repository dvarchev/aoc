import _ from "lodash";
import { cl } from "../utils/index.js";

const t1 = {
    input: `forward 5
down 5
forward 8
up 3
down 8
forward 2`,
    expected: 150,
};

function parseInput(rawInput: string): [string, number][] {
    return rawInput
        .split("\n")
        .map((l) => l.split(" "))
        .map(([cmd, n]) => [cmd, +n]);
}

const moves: { [key: string]: [number, number] } = {
    up: [0, -1],
    down: [0, 1],
    forward: [1, 0],
};

export function solvePart1(rawInput: string) {
    const input = parseInput(rawInput);
    let pos = [0, 0];
    input.forEach(([cmd, n]) => {
        let [x, y] = pos,
            move = moves[cmd];
        x += move[0] * n;
        y += move[1] * n;
        pos = [x, y];
    });

    return pos[0] * pos[1];
}

const t2 = {
    ...t1,
    expected: 900,
};

export function solvePart2(rawInput: string) {
    const input = parseInput(rawInput);
    let pos = [0, 0, 0];
    input.forEach(([cmd, n]) => {
        let [x, y, a] = pos,
            move = moves[cmd];
        x += move[0] * n;
        a += move[1] * n;
        y += move[0] * a * n;
        pos = [x, y, a];
    });

    return pos[0] * pos[1];
}

export const tests = [[t1], [t2]];
export const onlyTests = false;
