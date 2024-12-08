import { assertEquals } from "@std/assert";
import { Combination } from "js-combinatorics";
import { pipe, range } from "remeda";
import z from "zod";
import {
    type Cell,
    Cells,
    type Direction,
    Matrix,
} from "../data-structures/Matrix.ts";
import { maxBy } from "@std/collections/max-by";
import { minBy } from "@std/collections/min-by";
const example1 = await Deno.readTextFile(
    "d8/example-1.txt",
);
const example2 = await Deno.readTextFile(
    "d8/example-2.txt",
);

const example3 = await Deno.readTextFile(
    "d8/example-3.txt",
);

const real = await Deno.readTextFile(
    "d8/real.txt",
);

const buildMatrixFromRaw = (input: string) => {
    return pipe(
        input.split("\n").map((line) => line.split("")),
        z.array(z.array(z.string())).parse,
        (data) => new Matrix(data),
    );
};

const getAllAntennas = (matrix: Matrix<string>) => {
    const antennaMap = new Map<string, Cell<string>[]>();

    matrix.forEachCell((cell) => {
        const value = cell.value;
        if (value === ".") return;
        else {
            const currentVal = antennaMap.get(value) ?? [];
            antennaMap.set(value, [...currentVal, cell]);
        }
    });

    return antennaMap;
};

const getAllPossibleAntinodes = (
    antennaMap: Map<string, Cell<string>[]>,
    matrix: Matrix<string>,
): Map<string, Direction[]> => {
    const allPossibleAntinodes = new Map<
        string,
        Direction[]
    >();

    for (const entry of [...antennaMap.entries()]) {
        const [char, cells] = entry;
        const allCombos = new Combination(cells, 2)
            .toArray();
        for (const [cellA, cellB] of allCombos) {
            const slope = Cells.slope(cellA, cellB);

            // console.log(slope);
            const { x, y } = Cells.distance(cellA, cellB);

            const rightCell = maxBy(
                [cellA, cellB],
                (n) => n.position[1],
            )!;
            const leftCell = minBy(
                [cellA, cellB],
                (n) => n.position[1],
            )!;

            const currentAntinodes =
                allPossibleAntinodes.get(char) ?? [];

            if (slope > 0) {
                const newPotentialRightCellPositions = pipe(
                    range(0, 100),
                    (r) =>
                        r.map((n) =>
                            [
                                rightCell.position[0] +
                                y * n,
                                rightCell.position[1] +
                                x * n,
                            ] satisfies Direction
                        ),
                );
                const newPotentialLeftCellPositions = pipe(
                    range(0, 100),
                    (r) =>
                        r.map((n) =>
                            [
                                leftCell.position[0] -
                                y * n,
                                leftCell.position[1] -
                                x * n,
                            ] satisfies Direction
                        ),
                );
                allPossibleAntinodes.set(char, [
                    ...currentAntinodes,
                    ...newPotentialRightCellPositions,
                    ...newPotentialLeftCellPositions,
                ]);
            } else {
                const newPotentialRightCellPositions = pipe(
                    range(0, 100),
                    (r) =>
                        r.map((n) =>
                            [
                                rightCell.position[0] -
                                y * n,
                                rightCell.position[1] +
                                x * n,
                            ] satisfies Direction
                        ),
                );
                const newPotentialLeftCellPositions = pipe(
                    range(0, 100),
                    (r) =>
                        r.map((n) =>
                            [
                                leftCell.position[0] +
                                y * n,
                                leftCell.position[1] -
                                x * n,
                            ] satisfies Direction
                        ),
                );
                allPossibleAntinodes.set(char, [
                    ...currentAntinodes,
                    ...newPotentialLeftCellPositions,
                    ...newPotentialRightCellPositions,
                ]);
                // right goes up
                // right goes down
            }
        }
    }
    return allPossibleAntinodes;
};

const applyAntinodesToMatrix = (
    matrix: Matrix<string>,
    antinodesMap: Map<string, Direction[]>,
) => {
    for (
        const [_val, positions] of antinodesMap.entries()
    ) {
        for (const position of positions) {
            if (matrix.cellAt(position)) {
                matrix.changeCellValue(position, "#");
            }
        }
    }
    return matrix;
};

const countThePounds = (input: Matrix<string>) =>
    input.findAllCellsWhere((l) => l.value === "#").length;

const getMatrixFor = (input: string) => {
    const matrix = buildMatrixFromRaw(input);
    const antennas = getAllAntennas(matrix);
    const antinodes = getAllPossibleAntinodes(
        antennas,
        matrix,
    );
    const applied = applyAntinodesToMatrix(
        matrix,
        antinodes,
    );
    console.log(applied.printText());
    return applied;
};

pipe(getMatrixFor(real), countThePounds, console.log);

// countThePounds(getMatrixFor(example3));
