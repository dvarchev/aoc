import _ from "lodash";
import { cl } from "../utils/index.js";

const t1 = {
    input: `30373
25512
65332
33549
35390`,
    expected: 21,
};

function parseInput(rawInput: string) {
    const input = rawInput.split("\n").map((l) => l.split("").map((n) => +n));

    const inputReversed = input[0].map((n) => [n]);
    for (let i = 1; i < input.length; i++)
        input[i].forEach((n, j) => inputReversed[j].push(n));
    return { input, inputReversed };
}

function getLTRBArrays(
    input: number[][],
    inputReversed: number[][],
    i: number,
    j: number,
) {
    const row = input[i];
    const l = row.slice(0, j);
    const r = row.slice(j + 1, row.length);
    const col = inputReversed[j];
    const t = col.slice(0, i);
    const b = col.slice(i + 1, col.length);
    return { l, r, t, b };
}

function getVisibileFlag(
    i: number,
    j: number,
    input: number[][],
    inputReversed: number[][],
): number {
    const h = input[i][j];
    const { l, r, t, b } = getLTRBArrays(input, inputReversed, i, j);
    return _.some([l, r, t, b], (arr) => _.every(arr, (n) => h > n)) ? 1 : 0;
}

export function solvePart1(rawInput: string) {
    const { input, inputReversed } = parseInput(rawInput);

    const vals = input.flatMap((l, i) =>
        l.map((n, j) => getVisibileFlag(i, j, input, inputReversed)),
    );

    return _.sum(vals);
}

const t2 = {
    ...t1,
    expected: 8,
};

function getSceneticValue(
    i: number,
    j: number,
    input: number[][],
    inputReversed: number[][],
): number {
    const h = input[i][j];
    const { l: lr, r, t: tr, b } = getLTRBArrays(input, inputReversed, i, j);
    const l = lr.reverse();
    const t = tr.reverse();
    const vals = [l, t, r, b].map((a) => {
        const ind = a.findIndex((n) => n >= h);

        return ind < 0 ? a.length : ind + 1;
    });
    return vals.reduce((a, b) => a * b);
}

export function solvePart2(rawInput: string) {
    const { input, inputReversed } = parseInput(rawInput);
    const vals = input.flatMap((l, i) =>
        l.map((n, j) => getSceneticValue(i, j, input, inputReversed)),
    );
    return _.max(vals);
}

export const tests = [[t1], [t2]];
export const onlyTests = false;
