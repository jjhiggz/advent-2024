import { sortBy, unzip } from "@std/collections";
import { pipe } from "remeda";
const isReal = true;
const result = isReal
  ? await Deno.readTextFile("d1/real.txt")
  : await Deno.readTextFile("d1/example.txt");

const columns = (input: string) => {
  const asArray = pipe(
    input,
    (i) => i.split("\n"),
    (n) =>
      n.map((line) => line.split(/\s+/).map((n) => +n)),
  );

  const [left, right] = unzip(asArray);

  return {
    left,
    right,
  };
};

const processFile = (input: string) => {
  const { left, right } = columns(input);

  return left.reduce(
    (acc, el, i) => acc + Math.abs(el - right[i]),
    0,
  );
};

// 19437052
const processFileP2 = (input: string) => {
  const { left, right } = columns(input);

  return left.reduce(
    (acc, el) =>
      acc + el * right.filter((rel) => el === rel).length,
    0,
  );
};

console.log(processFileP2(result));
