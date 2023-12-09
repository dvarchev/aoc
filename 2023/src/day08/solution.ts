import { cl, Config } from "aoc-utils";

const t1 = {
  input: `LLR

AAA = (BBB, BBB)
BBB = (AAA, ZZZ)
ZZZ = (ZZZ, ZZZ)`,
  expected: 6,
};

function parseInput(rawInput: string): [string, { [key: string]: { [key: string]: string } }] {
  const [instructions, map] = rawInput.replaceAll("(", "").replaceAll(")", "").split("\n\n");
  return [
    instructions,
    map
      .lines()
      .map(l => l.split(" = "))
      .map(([s, t]): [string, string[]] => [s, t.split(", ")])
      .reduce((t, [s, [l, r]]) => ({ ...t, [s]: { l, r } }), {}),
  ];
}

export function solvePart1(rawInput: string) {
  const [instructions, map] = parseInput(rawInput);
  let cNode = "AAA";
  let steps = 0;
  let ii = 0;
  while (cNode !== "ZZZ") {
    cNode = instructions[ii] === "L" ? map[cNode].l : map[cNode].r;
    ii++;
    steps++;
    if (ii == instructions.length) ii = 0;
  }

  return steps;
}

const t2 = {
  input: `LR

11A = (11B, XXX)
11B = (XXX, 11Z)
11Z = (11B, XXX)
22A = (22B, XXX)
22B = (22C, 22C)
22C = (22Z, 22Z)
22Z = (22B, 22B)
XXX = (XXX, XXX)`,
  expected: 6,
};

export function gcd(a: number, b: number): number {
  if (!b) return a;
  return gcd(b, a % b);
}

export function lcm(numbers: number[]): number {
  if (numbers.length !== 2) return numbers.reduce((a, b) => lcm([a, b]));
  const [a, b] = numbers;
  return Math.abs(a * b) / gcd(a, b);
}

function getSteps(node: string, map: { [key: string]: { [key: string]: string } }, instructions: string): number {
  let steps = 0;

  while (node.at(-1) !== "Z") {
    const neighbors = map[node];
    const direction = instructions[steps % instructions.length];
    node = direction === "L" ? neighbors.l : neighbors.r;

    steps++;
  }

  return steps;
}

export function solvePart2(rawInput: string) {
  const [instructions, map] = parseInput(rawInput);

  let cNodes = Object.keys(map).filter(k => k.at(-1) === "A");

  const nodeSteps = cNodes.map(node => getSteps(node, map, instructions));

  return lcm(nodeSteps);
}

export const tests = [[t1], [t2]];
export const config: Config = {
  onlyTests: false,
};