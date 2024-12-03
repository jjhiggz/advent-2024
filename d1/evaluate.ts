import { sortBy } from "@std/collections";
import { pipe } from "remeda";
const isReal = true;
const result = isReal
  ? await Deno.readTextFile("d1/real.txt")
  : await Deno.readTextFile("d1/example.txt");

const processFile = (input: string) => {
  const asArray = pipe(
    input,
    (i) => i.split("\n"),
    (n) => n.map((line) => line.split(/\s+/).map((n) => +n))
  );

  const left = sortBy(
    asArray.map((n) => n[0]),
    (n) => n
  );
  const right = sortBy(
    asArray.map((n) => {
      return n[1];
    }),
    (n) => n
  );

  //   console.log(asArray);

  return left.reduce((acc, el, i) => acc + Math.abs(el - right[i]), 0);
};

const processFileP2 = (input: string) => {
  const asArray = pipe(
    input,
    (i) => i.split("\n"),
    (n) => n.map((line) => line.split(/\s+/).map((n) => +n))
  );

  const left = sortBy(
    asArray.map((n) => n[0]),
    (n) => n
  );

  const right = sortBy(
    asArray.map((n) => {
      return n[1];
    }),
    (n) => n
  );

  const rightMap = right.reduce(
    (acc, el) => acc.set(el, (acc.get(el) ?? 0) + 1),
    new Map<number, number>()
  );

  return left.reduce((acc, el) => (rightMap.get(el) ?? 0) * el + acc, 0);
};

console.log(processFileP2(result));
