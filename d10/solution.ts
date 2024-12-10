import { pipe, piped, sumBy, uniqueBy } from "remeda";
import z from "zod";
import {
    type Cell,
    Matrix,
    type Position,
} from "../data-structures/Matrix.ts";
import { match, P } from "ts-pattern";

const real = await Deno.readTextFile("d10/real.txt");

const getMatrix = piped(
    (input: string) =>
        input.trim().split("\n").map((line) =>
            line.split("")
        )
            .map((line) =>
                z.array(z.coerce.number().catch(-100))
                    .parse(
                        line,
                    )
            ),
    (n) => new Matrix(n),
);

const getAllTrails = (
    matrix: Matrix<number>,
    trailHeadPosition: Position,
    start: number = 0,
): Cell<number>[] => {
    const cell = matrix.cellAt(trailHeadPosition);
    if (cell?.value !== start) return [];
    if (cell?.value === 9) return [cell];
    return cell?.adjacentCells.array().flatMap((cellC) => {
        return match(cellC.location)
            .with(P.union("N", "E", "S", "W"), () => {
                if (cellC.cell.value === start + 1) {
                    return getAllTrails(
                        matrix,
                        cellC.cell.position,
                        start + 1,
                    );
                } else {
                    return [];
                }
            })
            .otherwise(() => []);
    });
};

const solution = (input: string, isP2: boolean) => {
    return pipe(
        input,
        getMatrix,
        (m) => {
            const allTrailheads = m.findAllCellsWhere((n) =>
                n.value === 0
            )
                .map((startingCell) => {
                    return {
                        trails: pipe(
                            getAllTrails(
                                m,
                                startingCell.position,
                                0,
                            ),
                            (trails) =>
                                isP2
                                    ? trails.length
                                    : uniqueBy(
                                        trails,
                                        (n) =>
                                            n.positionTag(),
                                    ).length,
                        ),
                        startingCell: startingCell
                            .positionTag(),
                    };
                });

            return sumBy(
                allTrailheads,
                (trailHeads) => trailHeads.trails,
            );
        },
    );
};

console.log(solution(real, true));
