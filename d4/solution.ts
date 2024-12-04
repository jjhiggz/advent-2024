import { uniqueBy } from "remeda";
import {
  type AdjacentLocation,
  type Cell,
  Constants,
  Matrix,
} from "../data-structures/Matrix.ts";
const exampleFile = await Deno.readTextFile(
  "d4/example.txt",
);
const realFile = await Deno.readTextFile("d4/real.txt");

const buildMatrix = (input: string) => {
  return new Matrix(
    input.split("\n").map((line) => line.split("")),
  );
};

const getCellDataP1 = (
  rootCell: Cell<string>,
): {
  validPaths: Cell<string>[][];
  touchedCells: Cell<string>[];
} => {
  const word = "XMAS";
  if (rootCell.value !== word[0]) {
    return {
      validPaths: [],
      touchedCells: [],
    };
  }

  const adjacentCellMap: Record<
    AdjacentLocation,
    Cell<string>[]
  > = {
    S: [],
    W: [],
    E: [],
    N: [],
    SW: [],
    DW: [],
    NW: [],
    NE: [],
  };

  for (
    let letterIndex = 1;
    letterIndex < word.length;
    letterIndex++
  ) {
    const letter = word[letterIndex];
    for (const location of Constants.allAdjacentLocations) {
      const cellsAtLocation = adjacentCellMap[location];
      if (cellsAtLocation.length !== letterIndex - 1) {
        continue;
      }
      const lastCell = cellsAtLocation.at(-1) ?? rootCell;

      const nextCell = lastCell.adjacentCells
        .array()
        .find(
          (adjacentCell) =>
            adjacentCell.location === location &&
            letter === adjacentCell.cell.value,
        );

      if (!nextCell) continue;
      adjacentCellMap[location].push(nextCell.cell);
    }
  }

  const validPaths = Object.values(adjacentCellMap).filter(
    (track) => track.length === word.length - 1,
  );
  const touchedCells = [
    rootCell,
    ...uniqueBy(
      validPaths.flat(),
      (cell) => cell.positionTag(),
    ),
  ];

  return {
    validPaths,
    touchedCells,
  };
};

const isCellValidCross = (cell: Cell<string>) => {
  if (cell.value !== "A") return false;

  const cellMap = cell.adjacentCells.map();

  const upperRight = cellMap["NE"]?.value;
  const upperLeft = cellMap["NW"]?.value;
  const lowerRight = cellMap["DW"]?.value;
  const lowerLeft = cellMap["SW"]?.value;

  const line1 = [upperRight, "A", lowerLeft];
  const line2 = [upperLeft, "A", lowerRight];

  return [line1, line2]
    .map((l) => l.filter((n) => n).join(""))
    .every((line) => {
      return line === "MAS" || line === "SAM";
    });
};

const solution = (input: string) => {
  const matrix = buildMatrix(input);

  const allValidStartingCells = matrix.findAllCellsWhere(
    (cell) => getCellDataP1(cell).validPaths.length > 0,
  );

  const allValidPaths = allValidStartingCells.map(
    (cell) => getCellDataP1(cell).validPaths,
  );

  return allValidPaths.length;
};

const solutionP2 = (input: string) => {
  const matrix = buildMatrix(input);
  const xs = matrix.findAllCellsWhere(isCellValidCross);
  return xs.length;
};

console.log(solution(realFile));
console.log(solutionP2(realFile));
