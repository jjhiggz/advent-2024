import { range } from "remeda";
import { match } from "ts-pattern";

const solution = (line: string, blinkCt: number) => {
    const initialLine = line.split(" ").map(Number);
    const initialMap = new Map<number, number>();

    initialLine.forEach((n) =>
        initialMap.set(n, (initialMap.get(n) ?? 0) + 1)
    );

    return range(0, blinkCt).reduce(
        (mapAtBlink, _currBlink) => {
            const next = mapAtBlink.entries().reduce<
                Map<number, number>
            >(
                (acc, entry) => {
                    const [key, value] = entry;
                    const digs = key.toString();
                    const type = (() => {
                        if (key === 0) return "zero";
                        if (digs.length % 2 === 0) {
                            return "even";
                        }
                        return "odd";
                    })();

                    return match(type)
                        .with("even", () => {
                            const left = +digs.substring(
                                0,
                                digs.length / 2,
                            );
                            const right = +digs.substring(
                                digs.length / 2,
                            );
                            return acc
                                .set(
                                    left,
                                    (acc.get(left) ?? 0) +
                                        1 * value,
                                )
                                .set(
                                    right,
                                    (acc.get(right) ?? 0) +
                                        1 * value,
                                );
                        })
                        .with(
                            "odd",
                            () =>
                                acc.set(
                                    key * 2024,
                                    (acc.get(key * 2024) ??
                                        0) + 1 * value,
                                ),
                        )
                        .with(
                            "zero",
                            () =>
                                acc.set(
                                    1,
                                    (acc.get(1) ?? 0) +
                                        1 * value,
                                ),
                        )
                        .exhaustive();
                },
                new Map<number, number>(),
            );
            return next;
        },
        initialMap,
    )
        .values()
        .reduce((a, b) => a + b);
};

console.log(
    solution(`125 17`, 5),
);
