import { Config, cl } from "aoc-utils";

const t1 = {
  input: `root: pppw + sjmn
dbpl: 5
cczh: sllz + lgvd
zczc: 2
ptdq: humn - dvpt
dvpt: 3
lfqf: 4
humn: 5
ljgn: 2
sjmn: drzm * dbpl
sllz: 4
pppw: cczh / lfqf
lgvd: ljgn * ptdq
drzm: hmdt - zczc
hmdt: 32`,
  expected: 152,
};

type keyType = "+" | "-" | "/" | "*" | "=";
type opsNMap = {
  [key: string]: (a: number, b: number) => number;
};
type opsMap = {
  [key: string]: (a: string, b: string) => number | boolean;
};

const ops: opsNMap = {
  "+": (a, b) => a + b,
  "-": (a, b) => a - b,
  "/": (a, b) => a / b,
  "*": (a, b) => a * b,
  "=": (a, b) => a === b,
};
function parseInput(rawInput: string, opRepl: opsMap = {}) {
  const lines = rawInput.lines().map(l => l.split(": "));
  const funcs: { [key: string]: () => number } = {};

  lines.forEach(([name, expr]) => {
    const exArr = expr.split(" ");
    if (exArr.length > 1) {
      let op = ops[exArr[1] as keyType];
      if (opRepl[name]) {
        const ops = opRepl[name];
        funcs[name] = () => ops(exArr[0], exArr[2]);
      } else funcs[name] = () => op(funcs[exArr[0]](), funcs[exArr[2]]());
    } else {
      funcs[name] = () => +exArr[0];
    }
  });
  return funcs;
}

export function solvePart1(rawInput: string) {
  const input = parseInput(rawInput);

  return input["root"]();
}

const t2 = {
  ...t1,
  expected: 301,
};

export function solvePart2(rawInput: string) {
  let isLeft = false,
    currentOper = "left";
  const replacement = (opl: string, opr: string) => {
    const aVal = input[opl]();
    currentOper = "right";
    const bVal = input[opr]();
    return aVal === bVal;
  };
  const input = parseInput(rawInput, { root: replacement });
  const orig = input["humn"];
  input["humn"] = () => {
    return 3093175982595;
  };
  return input["root"]();
}

export const tests = [[t1], [t2]];

export const config: Config = {
  onlyTests: false,
};
