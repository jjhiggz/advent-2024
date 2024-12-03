import { pipe } from "remeda";
import { z } from "zod";
const real = await Deno.readTextFile("d3/real.txt");

const testStr =
  "xmul(2,4)%&mul[3,7]!@^do_not_mul(5,5)+mul(32,64]then(mul(11,8)mul(8,5))";

const p1 = (input: string) => {
  const matches = input
    .match(/mul\(\d+,\d+\)/g)
    ?.map((match) => match.match(/\d+/g)?.map((n) => +n));
  return matches?.reduce((acc, el) => acc + el[0] * el[1], 0);
};

const testStrP2 = `xmul(2,4)&mul[3,7]!^don't()_mul(5,5)+mul(32,64](mul(11,8)undo()?mul(8,5))`;

const getDataFromStr = (input: string) => {
  if (input === "don't()") return "don't" as const;
  if (input === "do()") return "do" as const;
  return pipe(
    input.match(/\d+/g)?.map((n) => +n),
    z.tuple([z.number(), z.number()]).parse
  );
};
const p2 = (input: string) => {
  const matches = input
    .match(/(mul\(\d+,\d+\))|do\(\)|don't\(\)/g)
    ?.map(getDataFromStr);
  if (!matches) {
    throw new Error("No Matches found");
  }

  let doIt = true;
  let sum = 0;
  for (let match of matches) {
    if (match === "don't") {
      doIt = false;
      continue;
    }
    if (match === "do") {
      doIt = true;
      continue;
    }
    if (doIt) sum += match[0] * match[1];
  }

  return sum;
};

// 356039 is too low

console.log(p2(real));
