import { cl, cmc, Config } from "aoc-utils";

const t1 = {
  input: `???.### 1,1,3
.??..??...?##. 1,1,3
?#?#?#?#?#?#?#? 1,3,1,6
????.#...#... 4,1,1
????.######..#####. 1,6,5
?###???????? 3,2,1`,
  expected: 21,
};

function parseInput(rawInput: string): [string[], number[]][] {
  return rawInput
    .lines()
    .map(l => l.split(" "))
    .map(([pattern, rules]) => [pattern.toArray(), rules.split(",").map(Number)]);
}

function getNumberOfPossibilities(
  pattern: string[],
  rules: number[],
  padWith: number = 0,
  knownResults: { [key: string]: number } = {},
): number {
  const currentKey = pattern.join("") + rules.join(",");
  if (Object.hasOwn(knownResults, currentKey)) return knownResults[currentKey];

  if (pattern.length === 0) return 0;
  if (rules.length === 1) {
    if (pattern[0] === "#") return 0;
    const [rule] = rules;
    return possibleMatches(pattern.slice(1), rule);
  }
  const maxPadding = pattern.length - (rules.sum() + rules.length - 2);

  let possibleMatchesCount = 0;
  for (let i = padWith; i <= maxPadding; i++) {
    const prefix = pattern.slice(0, i);
    if (prefix.some(c => c === "#")) continue;
    const [firstRule, ...restRules] = rules;
    const isPossible = isPossibleMatch(pattern.slice(i, i + firstRule), firstRule);
    if (isPossible) {
      const restIslandsMatches = getNumberOfPossibilities(pattern.slice(i + firstRule), restRules, 1, knownResults);
      if (restIslandsMatches <= 0) continue;
      possibleMatchesCount += restIslandsMatches;
    }
  }
  knownResults[currentKey] = possibleMatchesCount;
  return possibleMatchesCount;
}

function isPossibleMatch(pattern: string[], rule: number): boolean {
  return pattern.length === rule && pattern.every(c => c !== ".");
}
function possibleMatches(pattern: string[], rule: number): number {
  if (pattern.length === rule) return pattern.every(c => c !== ".") ? 1 : 0;

  let possibleMatchesCount = 0;
  for (let i = 0; i < pattern.length - rule + 1; i++) {
    const prefix = pattern.slice(0, i);
    if (prefix.some(c => c === "#")) return possibleMatchesCount;

    const isPossible = isPossibleMatch(pattern.slice(i, i + rule), rule);
    const restHasHash = pattern.slice(i + rule).some(c => c === "#");
    if (!isPossible || restHasHash) continue;
    possibleMatchesCount++;
  }
  return possibleMatchesCount;
}

export function solvePart1(rawInput: string) {
  const input = parseInput(rawInput);

  const patterns = input.map(([pattern, rules]) => getNumberOfPossibilities(pattern, rules));
  return patterns.sum();
}

const t2 = {
  ...t1,
  expected: 525152,
};

export function solvePart2(rawInput: string) {
  const input = parseInput(rawInput);
  const largerInput = input.map(([pattern, rules]) => {
    const patternString = pattern.join("");
    const patternLong = Array.times(5, () => patternString).join("?");
    const rulesLong = Array.times(5, () => [...rules]).flat();
    return [patternLong.toArray(), rulesLong] as [string[], number[]];
  });

  const patterns = largerInput.map(([pattern, rules], i) => {
    return getNumberOfPossibilities(pattern, rules);
  });

  return patterns.sum();
}
export const tests = [[t1], [t2]];
export const config: Config = {
  onlyTests: false,
};
