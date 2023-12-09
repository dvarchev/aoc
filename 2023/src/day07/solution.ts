import { cl, Config } from "aoc-utils";

const t1 = {
  input: `32T3K 765
T55J5 684
KK677 28
KTJJT 220
QQQJA 483`,
  expected: 6440,
};

function parseInput(rawInput: string): { hand: string; bid: number }[] {
  return rawInput
    .split("\n")
    .map(l => l.split(" "))
    .map(([hand, bid]) => ({ hand, bid: +bid }));
}

type NumberMap = { [key: string]: number };

function getHandMap(h: string[]): NumberMap {
  return h.reduce((a: NumberMap, b: string) => ({ ...a, [b]: (a[b] || 0) + 1 }), {});
}

function isNofKind(n: number, map: NumberMap): boolean {
  return Object.values(map).some(v => v === n);
}

function isFull(map: NumberMap): boolean {
  return isNofKind(3, map) && isNofKind(2, map);
}

function is2Pair(map: NumberMap): boolean {
  return Object.values(map).filter(v => v === 2).length === 2;
}

function handScore(h: string): number {
  const ha = h.toArray();
  const handMap = getHandMap(ha);
  if (isNofKind(5, handMap)) return 6;
  if (isNofKind(4, handMap)) return 5;
  if (isFull(handMap)) return 4;
  if (isNofKind(3, handMap)) return 3;
  if (is2Pair(handMap)) return 2;
  if (isNofKind(2, handMap)) return 1;
  return 0;
}

function compareByCards(h1: string, h2: string, cards: string): number {
  let i = h1.toArray().findIndex((l, i) => h2[i] !== l);
  return cards.indexOf(h1[i]) - cards.indexOf(h2[i]);
}

const cards1 = "23456789TJQKA";
const cards2 = "J23456789TQKA";

export function solvePart1(rawInput: string, cards = cards1, handScoreF = handScore) {
  const input = parseInput(rawInput);
  const sorted = input.sort((h1, h2) => {
    const scoreDifference = handScoreF(h1.hand) - handScoreF(h2.hand);
    return scoreDifference ? scoreDifference : compareByCards(h1.hand, h2.hand, cards);
  });
  return sorted.map((s, i) => (i + 1) * s.bid).sum();
}

const t2 = {
  ...t1,
  expected: 5905,
};
const hsf: number[] = [1, 3, 3, 5, 6, 6, 6];

export function solvePart2(rawInput: string) {
  return solvePart1(rawInput, cards2, (h: string): number => {
    const j = h.toArray().filter(c => c === "J").length;
    const hs = handScore(h);
    return j ? (hs == 2 ? hsf[hs] + j : hsf[hs]) : hs;
  });
}

export const tests = [[t1], [t2]];
export const config: Config = {
  onlyTests: false,
};
