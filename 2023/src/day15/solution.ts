import { cl, Config } from "aoc-utils";
import { has } from "lodash";

const t1 = {
  input: `rn=1,cm-,qp=3,cm=2,qp-,pc=4,ot=9,ab=5,pc-,pc=6,ot=7`,
  expected: 1320,
};

function parseInput(rawInput: string): [string, number][] {
  return rawInput.split(",").map(instr => {
    if (instr.at(-1) === "-") {
      return [instr.split("-")[0], 0];
    } else {
      const [label, length] = instr.split("=");
      return [label, +length];
    }
  });
}

function getHash(step: string) {
  let hash = 0;
  for (let i = 0; i < step.length; i++) {
    const charCode = step.charCodeAt(i);
    hash += charCode;
    hash *= 17;
    hash %= 256;
  }
  return hash;
}

export function solvePart1(rawInput: string) {
  const steps = rawInput.split(",");
  const stepHashes = steps.map(getHash);
  return stepHashes.sum();
}

const t2 = {
  ...t1,
  expected: 145,
};

export function solvePart2(rawInput: string) {
  const boxes: [string, number][][] = Array.times(256, () => []);
  const input = parseInput(rawInput);
  input.forEach(([label, strength]) => {
    const labelHash = getHash(label);
    const box = boxes[labelHash];
    const lensIndex = box.findIndex(([l, _]) => l === label);
    if (strength === 0) {
      if (lensIndex !== -1) {
        box.splice(lensIndex, 1);
      }
    } else {
      if (lensIndex !== -1) {
        box[lensIndex][1] = strength;
      } else {
        box.push([label, strength]);
      }
    }
  });
  return boxes.map((box, i) => box.map(([_, length], si) => (i + 1) * (si + 1) * length).sum()).sum();
}

export const tests = [[t1], [t2]];
export const config: Config = {
  onlyTests: false,
};
