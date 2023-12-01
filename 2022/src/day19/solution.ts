import { cl, dfs } from "../utils/index.js";

const t1 = {
  input: `Blueprint 1:
  Each ore robot costs 4 ore.
  Each clay robot costs 2 ore.
  Each obsidian robot costs 3 ore and 14 clay.
  Each geode robot costs 2 ore and 7 obsidian.

Blueprint 2:
  Each ore robot costs 2 ore.
  Each clay robot costs 3 ore.
  Each obsidian robot costs 3 ore and 8 clay.
  Each geode robot costs 3 ore and 12 obsidian.`,
  expected: 33,
};

function parseInput(rawInput: string) {
  rawInput = rawInput.replaceAll("\n\n", "\n").replaceAll("\n  Each", " Each");
  return rawInput.split("\n").map(
    l =>
      l
        .match(/\d+/g)!
        .map(n => +n)
        .slice(1) as [number, number, number, number, number, number],
  );
}

type Node = [number, number, number, number, number, number, number, number, number];
type Blueprint = [number, number, number, number, number, number];

function getNextStates(blueprint: Blueprint, node: Node, maxDepth: number, maxGeode: number): any[] {
  const [ore, clay, obs, geod, orRob, clRob, obRob, geRob, depth] = node;
  const [oreRobOreCost, clayRobOreCost, obsRobOreCost, obsRobClayCost, geoRobOreCost, geoRobObsCost] = blueprint;
  const maxOreCost = [oreRobOreCost, clayRobOreCost, obsRobOreCost, geoRobOreCost].max();
  const nextStates: any[] = [];
  const timeLeft = maxDepth - depth;
  if (timeLeft < 1) return [];

  if (geod + (timeLeft * (timeLeft + 1)) / 2 < maxGeode) return [];

  let nRob;

  // Build geode robot if possible

  if (obRob > 0) {
    const canBuildGeode = ore >= geoRobOreCost && obs >= geoRobObsCost;
    const timeToAdd = canBuildGeode
      ? 1
      : 1 + Math.max(Math.ceil((geoRobOreCost - ore) / orRob), Math.ceil((geoRobObsCost - obs) / obRob));
    const nDepth = depth + timeToAdd;
    nRob = [
      ore + orRob * timeToAdd - geoRobOreCost,
      clay + clRob * timeToAdd,
      obs + obRob * timeToAdd - geoRobObsCost,
      geod + timeLeft - timeToAdd,
      orRob,
      clRob,
      obRob,
      geRob + 1,
      nDepth,
    ];
    nextStates.push(nRob);
    if (canBuildGeode) return nextStates;
  }
  // Build obs robot if possible

  if (clRob > 0) {
    let canBuildObs = ore >= obsRobOreCost && clay >= obsRobClayCost;
    const timeToAdd = canBuildObs
      ? 1
      : 1 + Math.max(Math.ceil((obsRobOreCost - ore) / orRob), Math.ceil((obsRobClayCost - clay) / clRob));
    const nDepth = depth + timeToAdd;
    if (timeLeft > 2) {
      nRob = [
        ore + timeToAdd * orRob - obsRobOreCost,
        clay + timeToAdd * clRob - obsRobClayCost,
        obs + timeToAdd * obRob,
        geod,
        orRob,
        clRob,
        obRob + 1,
        geRob,
        nDepth,
      ];
      nextStates.push(nRob);
    }
  }

  // Build clay robot if possible
  if (clRob < obsRobClayCost) {
    const canBuildClay = ore >= clayRobOreCost;
    const timeToAdd = canBuildClay ? 1 : 1 + Math.ceil((clayRobOreCost - ore) / orRob);
    const nDepth = depth + timeToAdd;
    nRob = [
      ore + timeToAdd * orRob - clayRobOreCost,
      clay + timeToAdd * clRob,
      obs + timeToAdd * obRob,
      geod,
      orRob,
      clRob + 1,
      obRob,
      geRob,
      nDepth,
    ];
    nextStates.push(nRob);
  }

  // Build ore robot if possible
  if (orRob < maxOreCost) {
    const canBuildOreRob = ore >= oreRobOreCost;
    const timeToAdd = canBuildOreRob ? 1 : 1 + Math.ceil((oreRobOreCost - ore) / orRob);
    const nDepth = depth + timeToAdd;
    nRob = [
      ore + timeToAdd * orRob - oreRobOreCost,
      clay + timeToAdd * clRob,
      obs + timeToAdd * obRob,
      geod,
      orRob + 1,
      clRob,
      obRob,
      geRob,
      nDepth,
    ];
    nextStates.push(nRob);
  }
  return nextStates;
}

function getBestGeodesCount(blueprint: Blueprint, mins: number) {
  const initialState = [0, 0, 0, 0, 1, 0, 0, 0, 0];
  let bestGeodesCount = 0;
  dfs(
    initialState,
    node => getNextStates(blueprint, node, mins, bestGeodesCount),
    node => {
      const ndepth: number = node.last()!;
      if (ndepth <= mins) {
        const geodes = node[3];
        bestGeodesCount = Math.max(bestGeodesCount, geodes);
      }
    },
    mins,
  );
  return bestGeodesCount;
}
export function solvePart1(rawInput: string) {
  const input = parseInput(rawInput);
  const geodes = input.map(bp => getBestGeodesCount(bp, 24));
  const sum = geodes.map((gc, i) => gc * (i + 1)).sum();

  return sum;
}

const t2 = {
  ...t1,
  expected: 62 * 56,
};

export function solvePart2(rawInput: string) {
  const input = parseInput(rawInput).slice(0, 3);
  const [g1, g2, g3] = input.map(bp => getBestGeodesCount(bp, 32));
  const res = g1 * g2 * (g3 || 1);
  return res;
}

export const tests = [[t1], [t2]];
export const onlyTests = false;
