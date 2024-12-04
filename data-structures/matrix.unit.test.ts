import { Matrix } from "./Matrix.ts";
import { assertEquals } from "@std/assert";

// deno-fmt-ignore
const matrixData = [
    ["00", "01", "02"],
    ["10", "11", "12"],
    ["20", "21", "22"],
];

Deno.test("Should return length and width", () => {
    const matrix = new Matrix<string>([...matrixData, [
        "30",
        "31",
        "32",
    ]]);

    assertEquals(matrix.height, 4);
    assertEquals(matrix.width, 3);
    assertEquals(matrix.size, 12);
});

Deno.test("Should return columns", () => {
    const matrix = new Matrix<string>(matrixData);
    const columns = matrix.colsAsRaw();
    assertEquals(columns, [
        ["00", "10", "20"],
        ["01", "11", "21"],
        ["02", "12", "22"],
    ]);
});

Deno.test("Should return rows", () => {
    const matrix = new Matrix<string>(matrixData);
    const rows = matrix.rowsAsRaw();
    assertEquals(rows, [
        ["00", "01", "02"],
        ["10", "11", "12"],
        ["20", "21", "22"],
    ]);
});

Deno.test("should grab a submatrix", () => {
    const matrix = new Matrix<string>(matrixData);
    const submatrix = matrix.subMatrix({
        firstRow: 1,
        lastRow: 2,
        firstColumn: 1,
        lastColumn: 2,
    });

    assertEquals(submatrix.rowsAsRaw(), [
        ["11", "12"],
        ["21", "22"],
    ]);
});

Deno.test("should sum each row by a callback", () => {
    const matrix = new Matrix([
        [1, 2, 3],
        [4, 5, 6],
        [7, 8, 9],
    ]);
    const sum = matrix.sumEachRowBy((cell) => +cell.value!);
    assertEquals(sum, [6, 4 + 5 + 6, 7 + 8 + 9]);
});

Deno.test("should create a new matrix by cell", () => {
    const matrix = new Matrix([
        [1, 2, 3],
        [4, 5, 6],
        [7, 8, 9],
    ]);

    const newMatrix = matrix.map((cell) =>
        (cell.value! * 2).toString()
    );

    assertEquals(newMatrix.rowsAsRaw(), [
        ["2", "4", "6"],
        ["8", "10", "12"],
        ["14", "16", "18"],
    ]);
});

Deno.test("should transpose a matrix", () => {
    const matrix = new Matrix([
        [1, 2, 3],
        [4, 5, 6],
        [7, 8, 9],
    ]);
    const transposed = matrix.transpose();
    assertEquals(transposed.rowsAsRaw(), [
        [1, 4, 7],
        [2, 5, 8],
        [3, 6, 9],
    ]);
});

Deno.test("should push a row", () => {
    const matrix = new Matrix([
        [1, 2, 3],
        [4, 5, 6],
        [7, 8, 9],
    ]);
    matrix.pushRow([10, 11, 12]);
    assertEquals(matrix.rowsAsRaw(), [
        [1, 2, 3],
        [4, 5, 6],
        [7, 8, 9],
        [10, 11, 12],
    ]);
});

Deno.test("should push a col", () => {
    const matrix = new Matrix([
        [1, 2, 3],
        [4, 5, 6],
        [7, 8, 9],
    ]);
    matrix.pushCol([10, 11, 12]);
    assertEquals(matrix.rowsAsRaw(), [
        [1, 2, 3, 10],
        [4, 5, 6, 11],
        [7, 8, 9, 12],
    ]);
});

Deno.test("should dot product", () => {
    const matrix = new Matrix([
        [1, 2, 3],
    ]);
    const other = new Matrix([
        [1, 2, 3],
    ]);
    const dot = matrix.dotProduct(other, (n) => n);
    assertEquals(dot, 1 * 1 + 2 * 2 + 3 * 3);
});
