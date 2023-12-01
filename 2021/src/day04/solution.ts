import _ from "lodash";
import { cl, readFile } from "../utils/index.js";

const t1 = {
    input: readFile("./test1.txt", import.meta.url),
    expected: 4512,
};

function parseInput(rawInput: string): {
    numbers: number[];
    cards: number[][][];
} {
    const [numbersLine, ...bingoCards] = rawInput.split("\n\n");
    const numbers = numbersLine.split(",").map((n) => +n);
    const cards = bingoCards.map((card) =>
        card.split("\n").map((cl) =>
            cl
                .replace("  ", " ")
                .trim()
                .split(" ")
                .map((n) => +n),
        ),
    );
    return { numbers, cards };
}

function markNumber(card: number[][], n: number) {
    card.forEach((l, i) =>
        l.forEach((cn, j) => {
            if (n === cn) card[i][j] = -1;
        }),
    );
}
function isWinningCard(card: number[][]): any {
    const cols = card[0].length;
    return (
        _.some(card, (l) => _.every(l, (n) => n === -1)) ||
        _.some(Array.times(cols), (c) => _.every(card, (l) => l[c] === -1))
    );
}
function getNonNegativeSum(bingoCard: number[][]) {
    return bingoCard.reduce(
        (s, l) => s + l.reduce((ls, n) => ls + (n === -1 ? 0 : n), 0),
        0,
    );
}

function playBingoUntil(
    numbers: number[],
    cards: number[][][],
    cardsLeft: number,
) {
    let i = 0,
        n: number,
        bingoCard;
    do {
        n = numbers[i];
        cards.forEach((c) => markNumber(c, n));
        bingoCard = cards.find((card) => isWinningCard(card));
        cards = cards.filter((card) => !isWinningCard(card));
        i++;
    } while (cards.length > cardsLeft);
    return { bingoCard, n };
}

export function solvePart1(rawInput: string) {
    let { numbers, cards } = parseInput(rawInput);
    let { bingoCard, n } = playBingoUntil(numbers, cards, cards.length - 1);
    const restN = getNonNegativeSum(bingoCard!);
    return n * restN;
}

const t2 = {
    ...t1,
    expected: 1924,
};

export function solvePart2(rawInput: string) {
    let { numbers, cards } = parseInput(rawInput);
    let { bingoCard, n } = playBingoUntil(numbers, cards, 0);
    const restN = getNonNegativeSum(bingoCard!);
    return n * restN;
}

export const tests = [[t1], [t2]];
export const onlyTests = false;
