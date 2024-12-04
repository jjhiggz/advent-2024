export type Position = [number, number];
export type AdjacentLocation = (typeof allAdjacentLocations)[number];
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
  position: Position;
  positionTag: () => string;
  value: T | undefined;
  adjacentCells: () => AdjacentCellWrap<T>[];
};

type TraverseDirection = "up" | "down" | "left" | "right";

export const allAdjacentLocations = [
  "up",
  "left",
  "right",
  "down",
  "upper-right",
  "upper-left",
  "lower-left",
  "lower-right",
] as const;

const locationToDirections: Record<AdjacentLocation, TraverseDirection[]> = {
  right: ["right"],
  down: ["down"],
  up: ["up"],
  left: ["left"],
  "lower-left": ["left", "down"],
  "lower-right": ["right", "down"],
  "upper-left": ["up", "left"],
  "upper-right": ["up", "right"],
};

const tagPosition = (position: Position) => `${position[0]}-${position[1]}`;

export const getPositionFromTag = (tag: string) =>
  tag.split("-").map((n) => +n) as Position;

export class Matrix<T> {
  matrix: T[][];

  constructor(initialValues: T[][]) {
    this.matrix = initialValues;
  }

  getTraversedCell = (
    position: Position,
    traverseDirections: TraverseDirection[]
  ): Cell<T> | undefined => {
    let [x, y] = position;
    for (const traverseDirection of traverseDirections) {
      switch (traverseDirection) {
        case "down":
          x++;
          continue;
        case "up":
          x--;
          continue;
        case "left":
          y--;
          continue;
        case "right":
          y++;
          continue;
      }
    }

    return this.cellAt([x, y]);
  };

  cellAt = (position: Position): Cell<T> | undefined => {
    const [x, y] = position;
    const valAt = this.matrix[x]?.[y];
    if (valAt === undefined) return undefined;
    const newCell: Cell<T> = {
      value: valAt,
      position,
      positionTag: () => tagPosition(position),
      adjacentCells: () =>
        allAdjacentLocations
          .map((location) => ({
            location,
            cell: this.getTraversedCell(
              position,
              locationToDirections[location]
            )!,
          }))
          .filter((n) => n.cell !== undefined),
    };

    return newCell;
  };

  rowsAsRaw = (): T[][] => {
    const rows: T[][] = [];

    for (const row of this.matrix) {
      rows.push([]);
      for (const j of row) {
        rows.at(-1)?.push(j);
      }
    }

    return rows;
  };

  rowsAsCells = (): Cell<T>[][] => {
    const rows: Cell<T>[][] = [];
    for (let i = 0; i < this.matrix.length; i++) {
      const row = this.matrix[i];
      rows.push([]);
      for (let j = 0; j < row.length; j++) {
        const cell = this.cellAt([i, j]);
        if (!cell) throw new Error(`Could not find cell at ${i}, ${j}`);
        rows.at(-1)?.push(cell);
      }
    }
    return rows;
  };

  cols = () => {};

  printText = (type: "letters" = "letters") => {
    if (type === "letters") {
      return this.rowsAsRaw()
        .map((n) => n.join(" "))
        .join("\n\n");
    }
    return this;
  };

  forEach = <R>(cb: (input: Cell<T>, i: number, j: number) => R) => {
    for (let i = 0; i < this.matrix.length; i++) {
      const row = this.matrix[i];
      for (let j = 0; j < row.length; j++) {
        const cell = this.cellAt([i, j]);
        if (!cell) throw new Error("Something went wrong");
        cb(cell, i, j);
      }
    }
  };

  findAll = (
    cb: (input: Cell<T>, i: number, j: number) => boolean
  ): Cell<T>[] => {
    const cells: Cell<T>[] = [];

    this.forEach((cell, i, j) => {
      if (cb(cell, i, j)) {
        cells.push(cell);
      }
    });

    return cells;
  };

  replaceValueWhere = (
    cb: (input: Cell<T>, i: number, j: number) => boolean,
    replaceWith: (input: T) => T
  ): Matrix<T> => {
    const cells = this.findAll(cb);
    const positions = cells.map((cell) => cell.position);

    return new Matrix(
      structuredClone(this.matrix).map((row, i) => {
        return row.map((valAtJ, j) => {
          const isValidPosition = positions.some(
            (position) => position[0] === i && position[1] === j
          );
          return isValidPosition ? replaceWith(valAtJ) : valAtJ;
        });
      })
    );
  };

  subMatrix = ({
    firstColumn,
    firstRow,
    lastColumn,
    lastRow,
  }: SubmatrixDef) => {
    return new Matrix(
      this.matrix
        .filter((_, i) => i >= firstRow && i <= lastRow)
        .map((row) => row.slice(firstColumn, lastColumn + 1))
    );
  };
}
