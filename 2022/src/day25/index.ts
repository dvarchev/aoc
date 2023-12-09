import { run } from "aoc-utils";
import { solvePart1, solvePart2, config, tests } from "./solution.js";

run({
  part1: {
    tests: tests[0],
    solution: solvePart1,
  },
  part2: {
    tests: tests[1],
    solution: solvePart2,
  },
  trimTestInputs: false,
  onlyTests: true,
  ...config,
});
