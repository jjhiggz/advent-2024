import { groupBy, pipe, uniqueBy } from "remeda";
import {
  allAdjacentLocations,
  getPositionFromTag,
  Matrix,
  type AdjacentLocation,
  type Cell,
} from "../data-structures/Matrix.ts";
const exampleFile = await Deno.readTextFile("d4/example.txt");
const realFile = await Deno.readTextFile("d4/real.txt");

const buildMatrix = (input: string) => {
  return new Matrix(input.split("\n").map((line) => line.split("")));
};

const getCellDataP1 = (
  rootCell: Cell<string>
): { validPaths: Cell<string>[][]; touchedCells: Cell<string>[] } => {
  const word = "XMAS";
  if (rootCell.value !== word[0]) {
    return {
      validPaths: [],
      touchedCells: [],
    };
  }

  const adjacentCellMap: Record<AdjacentLocation, Cell<string>[]> = {
    down: [],
    left: [],
    right: [],
    up: [],
    "lower-left": [],
    "lower-right": [],
    "upper-left": [],
    "upper-right": [],
  };

  for (let letterIndex = 1; letterIndex < word.length; letterIndex++) {
    const letter = word[letterIndex];
    for (const location of allAdjacentLocations) {
      const cellsAtLocation = adjacentCellMap[location];
      if (cellsAtLocation.length !== letterIndex - 1) {
        continue;
      }
      const lastCell = cellsAtLocation.at(-1) ?? rootCell;

      const nextCell = lastCell
        .adjacentCells()
        .find(
          (adjacentCell) =>
            adjacentCell.location === location &&
            letter === adjacentCell.cell.value
        );

      if (!nextCell) continue;
      adjacentCellMap[location].push(nextCell.cell);
    }
  }

  const validPaths = Object.values(adjacentCellMap).filter(
    (track) => track.length === word.length - 1
  );
  const touchedCells = [
    rootCell,
    ...uniqueBy(validPaths.flat(), (cell) => cell.positionTag()),
  ];

  return {
    validPaths,
    touchedCells,
  };
};

const isCellValidCross = (cell: Cell<string>) => {
  if (cell.value !== "A") return false;

  const cellMap = groupBy(cell.adjacentCells(), (n) => n.location);
  const upperRight = cellMap["upper-right"]?.[0]?.cell?.value;
  const upperLeft = cellMap["upper-left"]?.[0]?.cell?.value;
  const lowerRight = cellMap["lower-right"]?.[0]?.cell?.value;
  const lowerLeft = cellMap["lower-left"]?.[0]?.cell?.value;

  const line1 = [upperRight, lowerLeft].filter((n) => n);
  const line2 = [upperLeft, lowerRight].filter((n) => n);
  if (line1.length < 2) return false;
  if (line2.length < 2) return false;
  if (!["M", "S"].every((letter) => line1.includes(letter))) return false;
  if (!["M", "S"].every((letter) => line2.includes(letter))) return false;
  return true;
};

const solution = (input: string) => {
  const matrix = buildMatrix(input);

  const allValidStartingCells = matrix.findAll(
    (cell) => getCellDataP1(cell).validPaths.length > 0
  );

  const allValidPaths = allValidStartingCells.map(
    (cell) => getCellDataP1(cell).validPaths
  );

  const allTouchedCells = pipe(
    allValidStartingCells.map(getCellDataP1),
    (n) => n.map((cellData) => cellData.touchedCells),
    (n) => n.flat(),
    uniqueBy((n) => n.positionTag())
  );

  const correctedMatrix = matrix.replaceValueWhere(
    (cell) => {
      return !allTouchedCells.some(
        (touchedCell) => touchedCell.positionTag() === cell.positionTag()
      );
    },
    () => "."
  );
  let debug = false;
  if (debug) {
    console.log(correctedMatrix.printText());
  }

  return allValidPaths.length;
};

const solutionP2 = (input: string) => {
  const matrix = buildMatrix(input);
  const xs = matrix.findAll(isCellValidCross);
  console.log(xs.length);
};

solutionP2(realFile);
