import { cl } from "../utils/index.js";

const t1 = {
  input: `Game 1: 3 blue, 4 red; 1 red, 2 green, 6 blue; 2 green
Game 2: 1 blue, 2 green; 3 green, 4 blue, 1 red; 1 green, 1 blue
Game 3: 8 green, 6 blue, 20 red; 5 blue, 4 red, 13 green; 5 green, 1 red
Game 4: 1 green, 3 red, 6 blue; 3 green, 6 red; 3 green, 15 blue, 14 red
Game 5: 6 red, 1 blue, 3 green; 2 blue, 1 red, 2 green`,
  expected: 8,
};
type playT = { red: number; green: number; blue: number };
type gameT = playT[];

function parseInput(rawInput: string): gameT[] {
  return rawInput.split("\n").map(l =>
    l
      .split(": ")[1]
      .split("; ")
      .map(t => {
        const colors: [string, keyof playT][] = t.split(", ").map(ki => {
          return ki.split(" ") as [string, keyof playT];
        });
        return colors.reduce((a, b) => {
          a[b[1]] = +b[0];
          return a;
        }, {} as playT);
      }),
  );
}
const maxC: playT = {
  red: 12,
  green: 13,
  blue: 14,
};
function isPossible(game: gameT) {
  return !game.some(gp => gp.red > maxC.red || gp.green > maxC.green || gp.blue > maxC.blue);
}

export function solvePart1(rawInput: string) {
  const input = parseInput(rawInput);
  const possibleGames = input
    .map((g, i): [number, gameT] => [i + 1, g])
    .filter(gi => isPossible(gi[1]))
    .map(gi => gi[0]) as number[];

  return possibleGames.reduce((a, b) => a + b);
}

const t2 = {
  ...t1,
  expected: 2286,
};

export function solvePart2(rawInput: string) {
  const input = parseInput(rawInput);
  const minPossible = input.map(g => {
    return g.reduce(
      (a, b) => {
        a.red = Math.max(a.red, b.red || 0);
        a.green = Math.max(a.green, b.green || 0);
        a.blue = Math.max(a.blue, b.blue || 0);
        return a;
      },
      { red: 0, green: 0, blue: 0 },
    );
  });
  const powers = minPossible.map(mp => mp.red * mp.green * mp.blue) as number[];
  return powers.sum();
}

export const tests = [[t1], [t2]];
export const onlyTests = false;
