import { cl } from "../utils/index.js";

const t1 = {
  input: `Valve AA has flow rate=0; tunnels lead to valves DD, II, BB
Valve BB has flow rate=13; tunnels lead to valves CC, AA
Valve CC has flow rate=2; tunnels lead to valves DD, BB
Valve DD has flow rate=20; tunnels lead to valves CC, AA, EE
Valve EE has flow rate=3; tunnels lead to valves FF, DD
Valve FF has flow rate=0; tunnels lead to valves EE, GG
Valve GG has flow rate=0; tunnels lead to valves FF, HH
Valve HH has flow rate=22; tunnel leads to valve GG
Valve II has flow rate=0; tunnels lead to valves AA, JJ
Valve JJ has flow rate=21; tunnel leads to valve II`,
  expected: 1651,
};

function parseInput(rawInput: string): [string, number, string[]][] {
  const linesStripped = rawInput
    .split("\n")
    .map(
      l =>
        l
          .replace("Valve ", "")
          .replace(" has flow rate=", ";")
          .replace(" tunnels lead to valves ", "")
          .replace(" tunnel leads to valve ", "")
          .split(";") as [string, string, string],
    );
  return linesStripped.map(([nName, rateStr, neighboursStr]) => [nName, +rateStr, neighboursStr.split(", ")]);
}

function getCurrentFlow(rates: { [key: string]: number }, opened: { [key: string]: boolean }): number {
  return Object.keys(opened)
    .map(k => rates[k])
    .sum();
}

function getMaxFlow(
  neighboursMap: { [key: string]: string[] },
  rates: { [key: string]: number },
  opened: { [key: string]: boolean },
  currents: string,
  time: number,
  foundMaxFlows: { [key: string]: number },
) {
  const current = currents;
  const currentStateKey = `${current};${Object.keys(opened).sort()};${time}`;
  if (foundMaxFlows[currentStateKey]) return foundMaxFlows[currentStateKey];

  const currentFlow = getCurrentFlow(rates, opened);
  if (time === 1) return currentFlow;
  // if (time >= 20) cl(current, time, currentFlow);

  const flows: number[] = [];

  if (!opened[current] && rates[current] > 0) {
    const newOpened = { ...opened, [current]: true };
    const toOpenMaxFlow = getMaxFlow(neighboursMap, rates, newOpened, current, time - 1, foundMaxFlows);
    flows.push(toOpenMaxFlow);
  }
  const moveToNeighboursFlows = neighboursMap[current].map(n => {
    return getMaxFlow(neighboursMap, rates, opened, n, time - 1, foundMaxFlows);
  });
  flows.push(...moveToNeighboursFlows);
  const maxFlow = currentFlow + flows.max();
  foundMaxFlows[currentStateKey] = maxFlow;
  return maxFlow;
}

function getMaxFlow2(
  neighboursMap: { [key: string]: string[] },
  rates: { [key: string]: number },
  opened: { [key: string]: boolean },
  currents: string,
  time: number,
  foundMaxFlows: { [key: string]: number },
) {
  const current = currents;
  const currentStateKey = `${current};${Object.keys(opened).sort()};${time}`;
  if (foundMaxFlows[currentStateKey]) return foundMaxFlows[currentStateKey];

  const currentFlow = getCurrentFlow(rates, opened);
  if (time === 1) return currentFlow;
  // if (time >= 20) cl(current, time, currentFlow);

  const flows: number[] = [];

  if (!opened[current] && rates[current] > 0) {
    const newOpened = { ...opened, [current]: true };
    const toOpenMaxFlow = getMaxFlow(neighboursMap, rates, newOpened, current, time - 1, foundMaxFlows);
    flows.push(toOpenMaxFlow);
  }
  const moveToNeighboursFlows = neighboursMap[current].map(n => {
    return getMaxFlow(neighboursMap, rates, opened, n, time - 1, foundMaxFlows);
  });
  flows.push(...moveToNeighboursFlows);
  const maxFlow = currentFlow + flows.max();
  foundMaxFlows[currentStateKey] = maxFlow;
  return maxFlow;
}

export function solvePart1(rawInput: string) {
  const input = parseInput(rawInput);
  // cl(input);
  const neighboursMap: { [key: string]: string[] } = {};
  const rates: { [key: string]: number } = {};
  const opened: { [key: string]: boolean } = {};
  input.map(l => {
    rates[l[0]] = l[1];
    neighboursMap[l[0]] = l[2];
  });
  const start = "AA";
  const time = 30;
  return getMaxFlow(neighboursMap, rates, opened, start, time, {});
}

const t2 = {
  ...t1,
  expected: 1707,
};

export function solvePart2(rawInput: string) {
  let answer1 = 0;
  const parsed = rawInput.split(`\n`);

  /** NODE => flow rate */
  const flowRates: Record<string, number> = {};
  /** NODE:NODE -> Hops */
  const shortestPaths: Record<string, number> = {};
  const allNodes = new Array<string>();
  const nodesWithFlow = new Array<string>();
  const flowNodeIndexes: Record<string, number> = {};

  // PARSE THE GRAPH
  for (const row of parsed) {
    const [, from, rate, toArray] =
      /Valve ([^)]+) has flow rate=(\d+); tunnels? leads? to valves? (.+)/.exec(row) ?? [];
    const flowRate = Number(rate);
    flowRates[from] = flowRate;
    allNodes.push(from);
    if (flowRate > 0) {
      nodesWithFlow.push(from);
      flowNodeIndexes[from] = nodesWithFlow.length;
    }
    shortestPaths[`${from}:${from}`] = 0;
    for (const to of toArray.split(", ")) {
      shortestPaths[`${from}:${to}`] = 1;
    }
  }

  // FLOYD WARSHALL to fill in remaining shortest paths.
  for (const hopNode of allNodes) {
    for (const node1 of allNodes) {
      for (const node2 of allNodes) {
        shortestPaths[`${node1}:${node2}`] = Math.min(
          shortestPaths[`${node1}:${node2}`] ?? 1e6,
          (shortestPaths[`${node1}:${hopNode}`] ?? 1e6) + (shortestPaths[`${hopNode}:${node2}`] ?? 1e6),
        );
      }
    }
  }

  function addOpen(current: number, node: string): number {
    const openMask = 1 << flowNodeIndexes[node];
    return current | openMask;
  }

  function isOpen(current: number, node: string): boolean {
    const openMask = 1 << flowNodeIndexes[node];
    // Stupid "prettier" won't let me inline this code and puts bad parentheses!
    const isOpenNum = current & openMask;
    return isOpenNum > 0;
  }

  /** This is AFTER we've visited a node and OPENED it. */
  type Item = {
    /** Valves that are open */
    openMask: number;
    /** How many minutes left */
    remaining: number;
    /** Current node */
    current: string;
    /** How much gas will flow out. */
    total: number;
  };

  function graphSearch(minutes: number, onVisit: (item: Item) => void) {
    const fringe: Array<Item> = [];
    fringe.push({ current: "AA", remaining: minutes, openMask: 0, total: 0 });
    const visited = new Set<string>();
    while (fringe.length > 0) {
      const item = fringe.pop()!;
      const { openMask, remaining, current, total } = item;
      const visitedKey = `${current}:${remaining}:${openMask}:${total}`;
      if (visited.has(visitedKey)) continue;
      visited.add(visitedKey);

      onVisit(item);

      if (remaining === 0) {
        continue;
      }

      for (const next of nodesWithFlow) {
        if (isOpen(openMask, next)) continue;
        const nextRemaining = remaining - shortestPaths[`${current}:${next}`] - 1;
        if (nextRemaining <= 0) continue;
        fringe.push({
          current: next,
          openMask: addOpen(openMask, next),
          remaining: nextRemaining,
          total: total + nextRemaining * flowRates[next],
        });
      }
    }
  }

  graphSearch(30, item => {
    answer1 = Math.max(item.total, answer1);
  });

  console.info(`Answer1: ${answer1} `);

  // ===========================================================
  // PART 2
  // ===========================================================

  let answer2 = 0;
  const bestAt26 = new Map<number, number>();
  graphSearch(26, item => {
    bestAt26.set(item.openMask, Math.max(bestAt26.get(item.openMask) ?? 0, item.total));
  });

  for (const [openMask1, best1] of bestAt26) {
    for (const [openMask2, best2] of bestAt26) {
      const overlap = openMask1 & openMask2;
      if (overlap !== 0) continue;
      answer2 = Math.max(answer2, best1 + best2);
    }
  }

  console.info(`Answer2: ${answer2} `);
  return answer2;
}

export const tests = [[t1], [t2]];
export const onlyTests = false;
