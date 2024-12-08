import { pipe, range, sumBy } from "remeda";
import { z } from "zod";
import { Permutation } from "js-combinatorics";
const real = await Deno.readTextFile("d7/real.txt");
const example = await Deno.readTextFile("d7/example.txt");

const parseLine = (line: string) => {
    const [rawTarget, rawNums] = line.split(":");

    const targetVal = pipe(
        rawTarget,
        z.coerce.number().parse,
    );

    const nums = rawNums.trim().split(" ").map(
        (n) => z.coerce.number().parse(n),
    );

    return [targetVal, nums] as const;
};

const multiply = (a: number, b: number) => a * b;
const add = (a: number, b: number) => a + b;
const getConcatValue = (a: number, b: number) =>
    pipe(
        a.toString() + b.toString(),
        z.coerce.number().parse,
    );
const isTestValid = (
    test: readonly [number, number[]],
    operators: ((a: number, b: number) => number)[],
) => {
    const target = test[0];
    const nums = test[1];
    if (nums.length === 1) {
        return nums[0] === target;
    } else {
        const [first, second, ...rest] = nums;

        return operators
            .some((operator): boolean =>
                isTestValid([
                    target,
                    [
                        operator(first, second),
                        ...rest,
                    ],
                ], operators)
            );
    }
};

const isTestValidNoRecursive = (
    test: readonly [number, number[]],
    operators: ((a: number, b: number) => number)[],
) => {
    const target = test[0];
    const nums = test[1];
    let operationCyclesApplied = 0;
    let solutions: number[] = [nums[0]];

    while (operationCyclesApplied < nums.length - 1) {
        solutions = solutions.map((solution, i) => {
            return operators.map((operator) =>
                operator(
                    solution,
                    nums[operationCyclesApplied + 1],
                )
            );
        }).flat();

        operationCyclesApplied++;
    }

    return solutions.some((solution) =>
        target === solution
    );
};

const solution1 = (input: string) => {
    const tests = pipe(
        input,
        (input) => input.split("\n").map(parseLine),
    );

    const filtered = tests.filter((test, i) => {
        return isTestValidNoRecursive(test, [
            add,
            multiply,
        ]);
    });
    return sumBy(filtered, (n) => n[0]);
    // .reduce((acc, el) => acc + el[0], 0);
};

const solution2 = (input: string) => {
    const tests = pipe(
        input,
        (input) => input.split("\n").map(parseLine),
    );

    const filtered = tests.filter((test, i) => {
        return isTestValid(test, [
            add,
            multiply,
            getConcatValue,
        ]);
    });

    return sumBy(filtered, (n) => n[0]);
};

const result1 = solution1(real);
console.log({ result1 });
// const result2 = solution2(real);
