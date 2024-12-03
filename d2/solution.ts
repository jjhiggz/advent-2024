import { pipe } from "remeda";
const exampleFile = await Deno.readTextFile("d2/example.txt");
const realFile = await Deno.readTextFile("d2/real.txt");

function isSafe(line: number[], depth = 0): boolean {
  const first = line.at(0);
  const last = line.at(-1);
  if (!first) throw new Error("No first number found for line" + line);

  if (!last) throw new Error("No last number found for line" + line);
  let mode = (() => {
    if (first < last) return "increasing" as const;
    if (first > last) return "decreasing" as const;
    return "unchanged" as const;
  })();

  const tryAgain = () =>
    depth > 0
      ? false
      : line.some((el, i) => {
          const withoutThatElement = line.filter((_, ii) => ii !== i);
          //   console.log({ withoutThatElement });
          return isSafe(withoutThatElement, 1);
        });

  if (mode === "unchanged") {
    return tryAgain();
  }

  let lastNum = first;

  for (const num of line.slice(1)) {
    switch (mode) {
      case "increasing":
        if (!(num > lastNum)) {
          return tryAgain();
        }
        break;
      case "decreasing":
        if (!(num < lastNum)) return tryAgain();
        break;
    }
    if (![1, 2, 3].includes(Math.abs(lastNum - num))) {
      return tryAgain();
    }
    lastNum = num;
  }
  return true;
}

function getAnswer(input: string) {
  return pipe(
    input,
    (input) => input.split("\n").map((n) => n.split(/\s+/).map((n) => +n)),
    (n) =>
      n.filter((line) => {
        const result = isSafe(line);
        return result;
      }),
    (n) => console.log(n.length)
    // (n) => n.length
  );
}

console.log(getAnswer(realFile));
