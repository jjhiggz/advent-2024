const getAllPossibleAntinodes = (
    antennaMap: Map<string, Cell<string>[]>,
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
                allPossibleAntinodes.set(char, [
                    ...currentAntinodes,
                    [
                        rightCell.position[0] + y,
                        rightCell.position[1] + x,
                    ],
                    [
                        leftCell.position[0] - y,
                        leftCell.position[1] - x,
                    ],
                ]);
            } else {
                allPossibleAntinodes.set(char, [
                    ...currentAntinodes,
                    [
                        rightCell.position[0] - y,
                        rightCell.position[1] + x,
                    ],
                    [
                        leftCell.position[0] + y,
                        leftCell.position[1] - x,
                    ],
                ]);
                // right goes up
                // right goes down
            }
        }
    }
    return allPossibleAntinodes;
};
