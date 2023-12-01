import { cl } from "../utils/index.js";

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

const ops = {
  "+": (a, b) => a + b,
  "-": (a, b) => a - b,
  "/": (a, b) => a / b,
  "*": (a, b) => a * b,
  "=": (a, b) => a === b,
};
function parseInput(rawInput: string, opRepl = {}) {
  const lines = rawInput.split("\n").map(l => l.split(": "));
  const functions = {};

  lines.forEach(([name, expr]) => {
    const exArr = expr.split(" ");
    if (exArr.length > 1) {
      let op = ops[exArr[1]];
      if (opRepl[name]) {
        op = opRepl[name];
        functions[name] = () => op(exArr[0], exArr[2]);
      } else functions[name] = () => op(functions[exArr[0]](), functions[exArr[2]]());
    } else {
      functions[name] = () => +exArr[0];
    }
  });
  return functions;
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
  const replacement = (opl, opr) => {
    const aVal = input[opl]();
    currentOper = "right";
    const bVal = input[opr]();
    cl(aVal);
    cl(bVal);
    return aVal === bVal;
  };
  const input = parseInput(rawInput, { root: replacement });
  const orig = input["humn"];
  input["humn"] = () => {
    cl(currentOper);
    return 3093175982595;
  };
  return input["root"]();
  // for(let i=-100_000; i <100_000; i++)
  //  210322230855108.84
  // {210322230808298.44
  //  210322230761488
  //  210322230340194.2
  //  210322183997873.2
  //
  //   input['humn'] = () => i;
  //   if(input['root']()) return i;
  // }
}

export const tests = [[t1], [t2]];
export const onlyTests = false;
