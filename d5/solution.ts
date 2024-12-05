import { pipe, sumBy } from "remeda";
import { z } from "zod";
import { Arr } from "../data-structures/Array.ts";

const example = await Deno.readTextFile("d5/example.txt");
const real = await Deno.readTextFile("d5/real.txt");

const getCorrectPageOrders = (input: string) => {
    return pipe(
        input,
        (input) => input.split("\n\n"),
        (chunks) => chunks[0],
        z.string().parse,
        (chunk) =>
            chunk.split("\n").map((l) =>
                l.split("|").map((val) => +val)
            ),
        z.array(z.tuple([z.number(), z.number()])).parse,
    );
};

const getUpdates = (input: string) => {
    return pipe(
        input,
        (input) => input.split("\n\n"),
        (chunks) => chunks[1],
        z.string().parse,
        (chunk) =>
            chunk.split("\n").map((l) =>
                l.split(",").map((val) => +val)
            ),
        z.array(z.array(z.number())).parse,
    );
};

const gIsValidPosition = (
    { order, updateIndex, updates }: {
        order: [number, number];
        update: number;
        updateIndex: number;
        updates: number[];
    },
) => {
    const updateIsLessThanIndex = updates.findIndex(
        (el) => el === order[1],
    );
    if (updateIsLessThanIndex === -1) {
        return true;
    }

    return updateIndex < updateIsLessThanIndex;
};

const isUpdateValid = (
    updates: number[],
    correctPageOrders: [number, number][],
) => {
    for (
        let updateIndex = 0;
        updateIndex < updates.length;
        updateIndex++
    ) {
        const update = updates[updateIndex];

        const pertinentOrders = correctPageOrders.filter(
            (order) => order[0] === update,
        );
        const isValidPosition = pertinentOrders.every(
            (order) =>
                gIsValidPosition({
                    order,
                    update,
                    updateIndex,
                    updates,
                }),
        );
        if (
            !isValidPosition
        ) {
            return false;
        }
    }
    return true;
};

const fixUpdateOrder = (
    input: number[],
    correctPageOrders: [number, number][],
) => {
    let newUpdates = input;

    let count = 0;
    while (!isUpdateValid(newUpdates, correctPageOrders)) {
        count++;
        newUpdates = Arr.moveItemLeftWhen(
            newUpdates,
            (update, updateIndex) => {
                const pertinentOrders = correctPageOrders
                    .filter(
                        (order) => order[0] === update,
                    );
                const result = pertinentOrders.some(
                    (order) => {
                        return !gIsValidPosition({
                            order,
                            update,
                            updateIndex,
                            updates: newUpdates,
                        });
                    },
                );

                return result;
            },
        );
    }

    return newUpdates;
};

const solutionP1 = (input: string) => {
    const correctPageOrders = getCorrectPageOrders(input);
    const updates = getUpdates(
        input,
    );
    const goodUpdates = updates.filter((update) =>
        isUpdateValid(update, correctPageOrders)
    );
    const middleNumbers = goodUpdates.map((n) =>
        Math.ceil(n.at(n.length / 2)!)
    );
    return sumBy(middleNumbers, (n) => n);
};

const solutionP2 = (input: string) => {
    const correctPageOrders = getCorrectPageOrders(input);
    const updates = getUpdates(
        input,
    );
    const badUpdates = updates.filter((update) =>
        !isUpdateValid(update, correctPageOrders)
    ).map((update) =>
        fixUpdateOrder(update, correctPageOrders)
    );

    const middleNumbers = badUpdates.map((n) =>
        Math.ceil(n.at(n.length / 2)!)
    );

    console.log(sumBy(middleNumbers, (n) => n));
};
// solutionP1(real)
solutionP2(real);
