import z from "zod";
import { pipe, uniqueBy } from "remeda";
import {
    Matrix,
    type Position,
} from "../data-structures/Matrix.ts";
import { match } from "ts-pattern";

const example = await Deno.readTextFile("d6/example.txt");
const real = await Deno.readTextFile("d6/real.txt");

const getMatrix = (input: string) => {
    return pipe(
        input.split("\n").map((line) => line.split("")),
        z.array(z.array(z.string())).parse,
        (n) => new Matrix(n),
    );
};

type Direction = "N" | "E" | "W" | "S";
const getNextDirection = (direction: Direction) => {
    return ({
        "N": "E",
        "E": "S",
        "S": "W",
        "W": "N",
    } as const)[direction];
};

const solution = (input: string) => {
    const matrix = getMatrix(input);
    const gaurd = matrix.findAllCellsWhere((cell) =>
        cell.value === "^"
    ).at(0);
    if (!gaurd) throw new Error("Could not find gaurd");

    let direction: Direction = "N";
    const positions: Position[] = [gaurd.position];

    while (true) {
        const currentPosition = positions.at(-1);
        if (!currentPosition) {
            throw new Error(
                "Cannot find position",
                currentPosition,
            );
        }

        // deno-fmt-ignore
        const nextPosition: Position = match(direction)
            .with("N", () => [currentPosition[0] - 1, currentPosition[1]] satisfies Position)
            .with("E", () => [currentPosition[0], currentPosition[1] + 1] satisfies Position)
            .with("S", () => [currentPosition[0] + 1, currentPosition[1]] satisfies Position)
            .with("W", () => [currentPosition[0] , currentPosition[1] - 1] satisfies Position)
            .exhaustive()

        const cellAtPosition = matrix.cellAt(nextPosition);

        if (!cellAtPosition) break;
        if (cellAtPosition.value === "#") {
            direction = getNextDirection(direction);
        } else {
            positions.push(nextPosition);
        }
    }

    const uniquePositions = uniqueBy(
        positions,
        (position) => `${position[0]}-${position[1]}`,
    );

    console.log(uniquePositions.length);
};

const serializeWalls = (input: Position[][]) =>
    input.map((pos) => pos.join("-"))
        .join(" ");

const solution2 = (input: string) => {
    const matrix = getMatrix(input);

    const result = matrix.findAllCellsWhere((cell) => {
        if (cell.value !== ".") return false;

        const gaurd = matrix.findAllCellsWhere((cell) =>
            cell.value === "^"
        ).at(0);
        if (!gaurd) throw new Error("Could not find gaurd");

        let direction: Direction = "N";
        const positions: Position[] = [gaurd.position];
        const hitWallsAt: Position[] = [];
        let prevRecords = new Map<string, number>();

        while (true) {
            const currentPosition = positions.at(-1);
            if (!currentPosition) {
                throw new Error(
                    "Cannot find position",
                    currentPosition,
                );
            }

            // deno-fmt-ignore
            const nextPosition: Position = match(direction)
            .with("N", () => [currentPosition[0] - 1, currentPosition[1]] satisfies Position)
            .with("E", () => [currentPosition[0], currentPosition[1] + 1] satisfies Position)
            .with("S", () => [currentPosition[0] + 1, currentPosition[1]] satisfies Position)
            .with("W", () => [currentPosition[0] , currentPosition[1] - 1] satisfies Position)
            .exhaustive()

            const cellAtPosition = matrix.cellAt(
                nextPosition,
            );

            const queueSize = 8;

            if (!cellAtPosition) break;
            if (
                cellAtPosition.value === "#" ||
                JSON.stringify(nextPosition) ===
                    JSON.stringify(cell.position)
            ) {
                if (hitWallsAt.length < queueSize) {
                    hitWallsAt.push(currentPosition);
                } else {
                    hitWallsAt.shift();
                    hitWallsAt.push(nextPosition);
                    const key = serializeWalls(hitWallsAt);
                    if (prevRecords.has(key)) {
                        return true;
                    } else {
                        prevRecords.set(key, 0);
                    }
                }
                direction = getNextDirection(direction);
            } else {
                positions.push(nextPosition);
            }
        }
        return false;
    });
    console.log(result.length);
};

// solution(real);
solution2(real);
