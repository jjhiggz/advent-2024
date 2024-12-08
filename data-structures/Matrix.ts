import { maxBy } from "@std/collections/max-by";
import { pipe, sumBy } from "remeda";

export type Direction = [number, number];
export type AdjacentLocation =
  (typeof allAdjacentLocations)[number];
export type SubmatrixDef = {
  firstRow: number;
  lastRow: number;
  firstColumn: number;
  lastColumn: number;
};
export type AdjacentCellWrap<T> = {
  location: AdjacentLocation;
  cell: Cell<T>;
};
export type Cell<T> = {
  position: Direction;
  positionTag: () => string;
  value: T;
  adjacentCells: {
    array: () => AdjacentCellWrap<T>[];
    map: () => Record<
      AdjacentLocation,
      Cell<T> | undefined
    >;
  };
};
type TraverseDirection = "N" | "S" | "W" | "E";

const allAdjacentLocations = [
  "N",
  "W",
  "E",
  "S",
  "NE",
  "NW",
  "SW",
  "DW",
] as const;

const locationToDirections: Record<
  AdjacentLocation,
  TraverseDirection[]
> = {
  E: ["E"],
  S: ["S"],
  N: ["N"],
  W: ["W"],
  "SW": ["W", "S"],
  "DW": ["E", "S"],
  "NW": ["N", "W"],
  "NE": ["N", "E"],
};

const tagPosition = (position: Direction) =>
  `${position[0]}-${position[1]}`;

const getPositionFromTag = (tag: string) =>
  tag.split("-").map((n) => +n) as Direction;

class Matrix<T> {
  rows: T[][];
  height: number;
  width: number;
  size: number;

  constructor(initialValues: T[][]) {
    this.rows = initialValues;
    this.height = initialValues.length;
    this.width = maxBy(initialValues, (row) => row.length)
      ?.length ?? 0;
    this.size = this.height * this.width;
  }

  getTraversedCell = (
    position: Direction,
    traverseDirections: TraverseDirection[],
  ): Cell<T> | undefined => {
    let [x, y] = position;
    for (const traverseDirection of traverseDirections) {
      switch (traverseDirection) {
        case "S":
          x++;
          continue;
        case "N":
          x--;
          continue;
        case "W":
          y--;
          continue;
        case "E":
          y++;
          continue;
      }
    }

    return this.cellAt([x, y]);
  };

  changeCellValue = (position: Direction, newValue: T) => {
    this.rows[position[0]][position[1]] = newValue;
  };

  cellAt = (position: Direction): Cell<T> | undefined => {
    const [x, y] = position;
    const valAt = this.rows[x]?.[y];
    if (valAt === undefined) return undefined;
    const newCell: Cell<T> = {
      value: valAt,
      position,
      positionTag: () => tagPosition(position),
      adjacentCells: {
        array: () =>
          allAdjacentLocations
            .map((location) => ({
              location,
              cell: this.getTraversedCell(
                position,
                locationToDirections[location],
              )!,
            }))
            .filter((n) => n.cell !== undefined),
        map: (): Record<
          AdjacentLocation,
          Cell<T> | undefined
        > => ({
          "SW": this.getTraversedCell(
            position,
            locationToDirections["SW"],
          ),
          N: this.getTraversedCell(
            position,
            locationToDirections["N"],
          ),
          S: this.getTraversedCell(
            position,
            locationToDirections["S"],
          ),
          W: this.getTraversedCell(
            position,
            locationToDirections["W"],
          ),
          E: this.getTraversedCell(
            position,
            locationToDirections["E"],
          ),
          "NW": this.getTraversedCell(
            position,
            locationToDirections["NW"],
          ),
          "NE": this.getTraversedCell(
            position,
            locationToDirections["NE"],
          ),
          "DW": this.getTraversedCell(
            position,
            locationToDirections["DW"],
          ),
        }),
      },
    };

    return newCell;
  };

  rowsAsRaw = (): T[][] => {
    return this.rows;
  };

  rowsAsCells = (): Cell<T>[][] => {
    return this.rows.map((row, i) =>
      row.map((_, j) => {
        const cell = this.cellAt([i, j]);
        if (cell == undefined) {
          throw new Error("Invalid Rows");
        }
        return cell;
      })
    );
  };

  colsAsCells = () => {
    const cols: Cell<T>[][] = [];
    const maxRow =
      maxBy(this.rows, (row) => row.length)?.length ?? 0;

    for (let j = 0; j < maxRow; j++) {
      for (let i = 0; i < this.rows.length; i++) {
        cols[j] = cols[j] ?? [];

        const cell = this.cellAt([i, j]);
        if (!cell) {
          continue;
        }
        cols[j].push(cell);
      }
    }

    return cols;
  };

  colsAsRaw = (): T[][] => {
    return this.colsAsCells().map((col) =>
      col.map((cell) => {
        if (!cell) {
          throw new Error("Invalid Cols");
        }
        return cell.value;
      })
    );
  };

  printText = (type: "letters" = "letters") => {
    if (type === "letters") {
      return this.rowsAsRaw()
        .map((n) => n.join(" "))
        .join("\n\n");
    }
    return this;
  };

  forEachCell = <R>(
    cb: (input: Cell<T>, i: number, j: number) => R,
  ) => {
    for (let i = 0; i < this.rows.length; i++) {
      const row = this.rows[i];
      for (let j = 0; j < row.length; j++) {
        const cell = this.cellAt([i, j]);
        if (!cell) throw new Error("Something went wrong");
        cb(cell, i, j);
      }
    }
  };

  sumEachCell = (
    cb: (input: Cell<T>, i: number, j: number) => number,
  ): number => {
    let sum = 0;
    this.forEachCell((cell, i, j) => {
      sum += cb(cell, i, j);
    });
    return sum;
  };

  findAllCellsWhere = (
    cb: (input: Cell<T>, i: number, j: number) => boolean,
  ): Cell<T>[] => {
    const cells: Cell<T>[] = [];

    this.forEachCell((cell, i, j) => {
      if (cb(cell, i, j)) {
        cells.push(cell);
      }
    });

    return cells;
  };

  replaceCellValueWhere = (
    cb: (input: Cell<T>, i: number, j: number) => boolean,
    replaceWith: (input: T) => T,
  ): Matrix<T> => {
    const cells = this.findAllCellsWhere(cb);
    const positions = cells.map((cell) => cell.position);

    return new Matrix(
      structuredClone(this.rows).map((row, i) => {
        return row.map((valAtJ, j) => {
          const isValidPosition = positions.some(
            (position) =>
              position[0] === i && position[1] === j,
          );
          return isValidPosition
            ? replaceWith(valAtJ)
            : valAtJ;
        });
      }),
    );
  };

  sumEachRowBy = (
    cb: (input: Cell<T>, i: number) => number,
  ) => {
    return this.rowsAsCells().map((row, i) =>
      pipe(
        row,
        sumBy((cell) => cb(cell, i)),
      )
    );
  };

  map = <Return>(
    cb: (cell: Cell<T>, i: number, j: number) => Return,
  ): Matrix<Return> => {
    return new Matrix(
      this.rowsAsCells().map((row, i) =>
        row.map((cell, j) => cb(cell, i, j))
      ),
    );
  };

  reduce = <Return>(
    cb: (
      acc: Return,
      cell: Cell<T>,
      i: number,
      j: number,
    ) => Return,
    initialValue: Return,
  ): Return => {
    return this.rowsAsCells().reduce(
      (acc, row, i) =>
        row.reduce(
          (acc, cell, j) => cb(acc, cell, i, j),
          acc,
        ),
      initialValue,
    );
  };

  subMatrix = ({
    firstColumn,
    firstRow,
    lastColumn,
    lastRow,
  }: SubmatrixDef) => {
    return new Matrix(
      this.rows
        .filter((_, i) => i >= firstRow && i <= lastRow)
        .map((row) =>
          row.slice(firstColumn, lastColumn + 1)
        ),
    );
  };

  pushRow = (row: T[]) => {
    this.rows.push(row);
  };

  pushCol = (col: T[]) => {
    for (let i = 0; i < col.length; i++) {
      this.rows[i].push(col[i]);
    }
  };

  transpose = (): Matrix<T> => {
    return new Matrix(this.colsAsRaw());
  };

  dotProduct = (
    other: Matrix<T>,
    extractValue: (input: T) => number,
  ): number => {
    let sum = 0;
    this.forEachCell((cell, i, j) => {
      const otherCell = other.cellAt([i, j]);
      if (!otherCell) throw new Error("Invalid other cell");

      sum += extractValue(cell.value) *
        extractValue(otherCell.value);
    });
    return sum;
  };
}

export const Cells = {
  distance: <T>(cell1: Cell<T>, cell2: Cell<T>) => {
    return {
      x: Math.abs(cell1.position[1] - cell2.position[1]),
      y: Math.abs(cell1.position[0] - cell2.position[0]),
    } as const;
  },
  slope: <T>(cell1: Cell<T>, cell2: Cell<T>) => {
    return (cell1.position[1] - cell2.position[1]) /
      (cell1.position[0] - cell2.position[0]);
  },
};

const Constants = {
  allAdjacentLocations,
  getPositionFromTag,
  locationToDirections,
};
export { Constants, Matrix };
