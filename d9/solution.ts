import { piped } from "remeda";
import z from "zod";
import { Arr } from "../data-structures/Array.ts";
const real = await Deno.readTextFile("d9/real.txt");

type FilesAndSpaceReturn = ReturnType<
    typeof getFilesAndSpace
>;
const getFilesAndSpace = (a: string) =>
    a.split("").map((char, index) => {
        const isEven = index % 2 === 0;

        const charValue = z.number().parse(+char);
        if (isEven) {
            return {
                type: "file",
                id: index / 2,
                size: charValue,
            } as const;
        } else {
            return {
                type: "space",
                size: charValue,
            } as const;
        }
    });

const getBlocks = piped(
    (input: FilesAndSpaceReturn) =>
        input.reduce(
            (acc, el) =>
                acc.concat(
                    el.type === "file"
                        ? Arr.repeat(el.id, el.size)
                        : Arr.repeat(".", el.size),
                ),
            [] as (number | string)[],
        ),
);

const isBlockDone = (block: (string | number)[]) => {
    let hitFree = false;
    for (const el of block) {
        if (el === ".") {
            hitFree = true;
        }
        if (hitFree && el !== ".") {
            return false;
        }
    }
    return true;
};

const reorgBlock = piped(
    (a: (string | number)[]): (string | number)[] => {
        if (isBlockDone(a)) return a;

        const clone = structuredClone(a);
        while (true) {
            // console.log(clone.join(""));
            if (isBlockDone(clone)) {
                break;
            }
            const firstDotIndex = clone.findIndex((n) =>
                n === "."
            );
            const lastLetterIndex = clone.findLastIndex((
                n,
            ) => n !== "." && n !== "0");

            clone[firstDotIndex] = clone[lastLetterIndex];
            clone[lastLetterIndex] = ".";
        }

        return clone;
    },
);

const reorgBlockP2 = piped(
    (input: FilesAndSpaceReturn) => {
        const fileIds = input.toReversed().map((n) => n?.id)
            .filter(
                (n) => n !== undefined,
            );

        for (const fileId of fileIds) {
            const fileIndex = input.findIndex((n) =>
                n?.id === fileId
            );
            const file = input[fileIndex];

            const validOpenSpaceIndex = input.findIndex((
                block,
                i,
            ) => block.type === "space" &&
                block.size >= file.size && i < fileIndex
            );

            if (validOpenSpaceIndex === -1) {
                continue;
            }

            const validOpenSpace =
                input[validOpenSpaceIndex];

            if (validOpenSpace.size === file.size) {
                input[validOpenSpaceIndex] = file;
                input[fileIndex] = validOpenSpace;
                continue;
            } else if (validOpenSpace.size > file.size) {
                input[validOpenSpaceIndex] = file;
                input[fileIndex] = {
                    type: "space",
                    size: file.size,
                };
                Arr.insertAfterWhenMut(
                    input,
                    (_, i) => i === validOpenSpaceIndex,
                    {
                        type: "space",
                        size: validOpenSpace.size -
                            file.size,
                    },
                );
            }
        }

        return input;
    },
);

const getChecksum = piped(
    (input: (string | number)[]) =>
        input.reduce<number>(
            (acc, curr, i) => {
                if (curr == ".") return acc + 0;
                return acc + z.number().parse(curr) * i;
            },
            0 satisfies number,
        ),
);

const solution = piped(
    getFilesAndSpace,
    reorgBlockP2,
    getBlocks,
    // (n) => n.join(""),
    getChecksum,
);
