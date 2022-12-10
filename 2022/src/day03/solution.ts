import _ from "lodash";
import { charMap, cl } from "../utils/index.js";

const t1 = {
    input: `vJrwpWtwJgWrhcsFMMfFFhFp
jqHRNqRjqzjGDLGLrsFMfFZSrLrFZsSL
PmmdzqPrVvPwwTWBwg
wMqvLMZHhHMvwLHjbvcjnnSBnvTQFn
ttgJtRGJQctTZtZT
CrZsJsPPZsGzwwsLwLmpwMDw`,
    expected: 157,
};

const ac = charMap["a"];
const Ac = charMap["A"];

function parseInput(rawInput: string) {
    return rawInput.split("\n");
}

const toCode = (cc: number) => (cc < ac ? cc - Ac + 27 : cc - ac + 1);

export function solvePart1(rawInput: string) {
    const input = parseInput(rawInput).map((l) => _.chunk(l, l.length / 2));
    return _(input)
        .map(([c1, c2]) =>
            _.find(c1, (c: string) => _.includes(c2, c))!.charCodeAt(0),
        )
        .map(toCode)
        .sum();
}

const t2 = {
    ...t1,
    expected: 70,
};

export function solvePart2(rawInput: string) {
    const input = parseInput(rawInput);

    return _(input)
        .chunk(3)
        .map(([c1l, c2l, c3l]): number =>
            _.find(
                c1l,
                (c: string) => _.includes(c2l, c) && _.includes(c3l, c),
            )!.charCodeAt(0),
        )
        .map(toCode)
        .sum();
}

export const tests = [[t1], [t2]];
export const onlyTests = false;
