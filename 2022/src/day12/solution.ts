import _ from "lodash";
import { Graph } from "../utils/graph.js";
import { charMap, cl } from "../utils/index.js";

const t1 = {
  input: `Sabqponm
abcryxxl
accszExk
acctuvwj
abdefghi`,
  expected: 31,
};

function parseInput(rawInput: string): { start: [number, number]; end: [number, number]; input: number[][] } {
  let start: [number, number], end: [number, number];
  const input: number[][] = rawInput.split("\n").map((l, i) =>
    l.split("").map((ch, j) => {
      if (ch === "S") {
        start = [i, j];
        return 25;
      }
      if (ch === "E") {
        end = [i, j];
        return 0;
      }
      return 25 - (charMap[ch] - charMap["a"]);
    }),
  );
  return { start: start!, end: end!, input };
}

const toName = (i: number, j: number) => `${i},${j}`;

function buildGraph(input: number[][]): Graph {
  const graph = new Graph();
  input.forEach((line, i) => {
    line.forEach((n, j) => {
      (
        [
          [(input[i - 1] ?? [])[j], toName(i - 1, j)],
          [input[i][j + 1], toName(i, j + 1)],
          [(input[i + 1] ?? [])[j], toName(i + 1, j)],
          [input[i][j - 1], toName(i, j - 1)],
        ] as [number | undefined, string][]
      )
        .filter(([next]) => next !== undefined)
        .forEach(([next, name]) => {
          if (n + 1 >= next!) graph.addEdge(toName(i, j), name);
        });
    });
  });
  return graph;
}

export function solvePart1(rawInput: string) {
  const { start, end, input } = parseInput(rawInput);
  const graph = buildGraph(input);

  const { distances } = graph.dijkstra(toName(...end));

  return distances[toName(...start)];
}

const t2 = {
  ...t1,
  expected: 29,
};

export function solvePart2(rawInput: string) {
  const { end, input } = parseInput(rawInput);
  const graph = buildGraph(input);

  const aNodes = input.flatMap((l, i) => l.map((n, j) => n === 25 && toName(i, j)).filter(n => n)) as string[];

  const { distances } = graph.dijkstra(toName(...end));

  const aDistances = aNodes.map(z => distances[z]);
  return aDistances.min();
}

export const tests = [[t1], [t2]];
export const onlyTests = false;
