import _ from "lodash";
import { cl } from "../utils/index.js";

const t1 = {
    input: `00100
11110
10110
10111
10101
01111
00111
11100
10000
11001
00010
01010`,
    expected: 198,
};

function parseInput(rawInput: string) {
    return rawInput.split("\n").map((l) => l.split("").map((b) => +b));
}

function getCommonBitAt(input: number[][], pos: number, bit: number = 1) {
    const half = input.length / 2;
    return input.filter((l) => l[pos]).length >= half ? bit : 1 - bit;
}

export function solvePart1(rawInput: string) {
    const input = parseInput(rawInput);
    const nBits = input[0].length;
    const a = _.times(nBits).map((i) => getCommonBitAt(input, i));
    const b = a.map((b) => (b ? 0 : 1));
    return [a, b].map((n) => parseInt(n.join(""), 2)).reduce((a, b) => a * b);
}

const t2 = {
    ...t1,
    expected: 230,
};

function filterByCommonBits(input: number[][], bit: number = 1): number {
    let leftNumbers = [...input],
        currentBit = 0;
    while (leftNumbers.length > 1) {
        const mostCommonBit = getCommonBitAt(leftNumbers, currentBit, bit);
        leftNumbers = leftNumbers.filter(
            (n) => n[currentBit] === mostCommonBit,
        );
        currentBit++;
    }
    const a = parseInt(leftNumbers[0].join(""), 2);
    return a;
}

export function solvePart2(rawInput: string) {
    const input = parseInput(rawInput);
    let a = filterByCommonBits(input);
    const b = filterByCommonBits(input, 0);
    return a * b;
}

export const tests = [[t1], [t2]];
export const onlyTests = false;
