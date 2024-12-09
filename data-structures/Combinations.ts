// Practice problems for flatMap, reduce and cartesian product

// Sample data
const numbers = [1, 2, 3, 4, 5];
const letters = ["a", "b", "c"];
const words = ["hello", "world", "typescript"];
const nested = [[1, 2], [3, 4], [5, 6]];
const objects = [
    { id: 1, tags: ["fun", "coding"] },
    { id: 2, tags: ["typescript", "fp"] },
    { id: 3, tags: ["practice", "coding"] },
];

// Problem 1: Use flatMap to create all possible pairs of numbers
// Expected: [1-1, 1-2, 1-3, 1-4, 1-5, 2-1, 2-2, ...]
const problem1 = () =>
    numbers.flatMap((x) =>
        numbers.flatMap((y) => `${x}-${y}`)
    );

// Problem 2: Use reduce to find the most common tag in objects
const problem2 = () =>
    objects.flatMap((n) => n.tags)
        .reduce(
            (acc, tag) =>
                tag in acc
                    ? { ...acc, [tag]: acc[tag] + 1 }
                    : { ...acc, [tag]: 1 },
            {} as Record<string, number>,
        );

// Problem 3: Create cartesian product of letters and numbers
// Expected: ['a1', 'a2', 'a3', 'b1', 'b2', 'b3', 'c1', 'c2', 'c3']
const problem3 = () =>
    letters.flatMap((letter) =>
        numbers.flatMap((number) => `${letter}${number}`)
    );

// Problem 4: Use reduce to create a frequency map of characters in all words
const problem4 = () =>
    words
        .flatMap((word) => word.split(""))
        .reduce((acc, char) => ({
            ...acc,
            [char]: (acc[char] || 0) + 1,
        }), {} as Record<string, number>);

// Problem 5: Flatten nested array and multiply each number by its index
const problem5 = () =>
    nested
        .flatMap((arr, i) => arr.map((num) => num * i));

// Problem 6: Create all possible three letter combinations from letters array
const problem6 = () =>
    letters.flatMap((a) =>
        letters.flatMap((b) =>
            letters.flatMap((c) => `${a}-${b}-${c}`)
        )
    );

// Problem 7: Use reduce to group objects by their first tag
const problem7 = () =>
    objects.reduce((acc, obj) => ({
        ...acc,
        [obj.tags[0]]: [...(acc[obj.tags[0]] || []), obj],
    }), {} as Record<string, typeof objects[number][]>);

// Problem 8: Create all possible number pairs that sum to 7
const problem8 = () =>
    numbers.flatMap((x) =>
        numbers.filter((y) => x + y === 7)
            .map((y) => [x, y])
    );

// Problem 9: Use reduce to create running sum array
// Input: [1,2,3,4,5] Output: [1,3,6,10,15]
const problem9 = () =>
    numbers.reduce(
        (
            acc,
            curr,
        ) => [...acc, (acc[acc.length - 1] || 0) + curr],
        [] as number[],
    );

// Problem 10: Create cartesian product of all arrays in nested
const problem10 = () =>
    nested.reduce(
        (acc, curr) =>
            acc.flatMap((x) => curr.map((y) => [...x, y])),
        [[]] as number[][],
    );

// Test cases
// console.log("Problem 1:", problem1());
// console.log("Problem 2:", problem2());
console.log("Problem 3:", problem3());
// console.log("Problem 4:", problem4());
// console.log("Problem 5:", problem5());
// console.log("Problem 6:", problem6());
// console.log("Problem 7:", problem7());
// console.log("Problem 8:", problem8());
// console.log("Problem 9:", problem9());
// console.log("Problem 10:", problem10());
