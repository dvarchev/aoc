import run from "aocrunner";
import { polifill } from "../utils/polifill.js";
import { solvePart1, solvePart2, onlyTests, tests } from "./solution.js";
polifill();
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
  onlyTests,
});
