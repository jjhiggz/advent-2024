/**
 * Non-mutative
 * Swaps two elements in an array based on predicate functions.
 * @param arr - The input array
 * @param whenA - Predicate function to find first element to swap
 * @param whenB - Predicate function to find second element to swap
 * @returns New array with swapped elements
 * @throws Error if either element is not found
 */
const swapPositionsWhen = <T>(
    arr: T[],
    whenA: (input: T, i: number) => boolean,
    whenB: (input: T, i: number) => boolean,
) => {
    const index1 = arr.findIndex(whenA);
    const index2 = arr.findIndex(whenB);
    if (index1 === -1) {
        throw new Error("Cannot swap if index -1");
    }
    if (index2 === -1) {
        throw new Error("Cannot swap if index -1");
    }

    const item1 = arr[index1]!;
    const item2 = arr[index2]!;

    return arr.map((item, i) => {
        if (i === index1) {
            return item2;
        }
        if (i === index2) {
            return item1;
        }
        return item;
    });
};

/**
 * Non-mutative
 * Swaps two elements in an array at specified indices.
 * @param arr - The input array
 * @param index1 - Index of first element to swap
 * @param index2 - Index of second element to swap
 * @returns New array with swapped elements
 */
const swapPositions = <T>(
    arr: T[],
    index1: number,
    index2: number,
) => {
    const item1 = arr[index1]!;
    const item2 = arr[index2]!;
    return arr.map((item, i) => {
        if (i === index1) return item2;
        if (i === index2) return item1;
        return item;
    });
};

/**
 * Non-mutative
 * Moves array element at position to the left by specified amount
 * @param arr - The input array
 * @param position - Position of element to move
 * @param by - Number of positions to move left (default: 1)
 * @returns New array with element moved left
 */
const moveItemLeft = <T>(
    arr: T[],
    position: number,
    by: number = 1,
) => {
    const item = arr[position]!;
    const afterItem = arr.slice(position + 1);
    const newPosition = position - by;
    const beforeNewPosition = arr.slice(0, newPosition);
    const afterNewPositionToItem = arr.slice(
        newPosition,
        position,
    );

    return [
        ...beforeNewPosition,
        item,
        ...afterNewPositionToItem,
        ...afterItem,
    ];
};

/**
 * Non-mutative
 * Rotates array elements to the left until predicate is satisfied.
 * @param arr - The input array
 * @param when - Predicate function to determine rotation point
 * @returns New array with elements rotated left
 */
const moveItemLeftWhen = <T>(
    arr: T[],
    when: (item: T, i: number) => boolean,
    by: number = 1,
) => {
    const index = arr.findIndex(when);

    return moveItemLeft(arr, index, by);
};

/**
 * Non-mutative
 * Rotates array elements to the right by specified index.
 * @param arr - The input array
 * @param index - Number of positions to rotate right
 * @returns New array with elements rotated right
 */
const moveItemRight = <T>(
    arr: T[],
    position: number,
    by: number = 1,
) => {
    const item = arr[position]!;
    const beforeItem = arr.slice(0, position);
    const cutsInFrontOfItem = arr.slice(
        position + 1,
        position + by + 1,
    );

    const afterItem = arr.slice(position + by + 1);

    return [
        ...beforeItem,
        ...cutsInFrontOfItem,
        item,
        ...afterItem,
    ];
};

/**
 * Non-mutative
 * Inserts an item at specified index in the array.
 * @param arr - The input array
 * @param index - Position to insert the item
 * @param item - Item to insert
 * @returns New array with inserted item
 */
const insertAt = <T>(arr: T[], index: number, item: T) => {
    return [
        ...arr.slice(0, index),
        item,
        ...arr.slice(index),
    ];
};

/**
 * Non-mutative
 * Inserts an item before the first element that matches the predicate.
 * @param arr - The input array
 * @param when - Predicate function to find insertion point
 * @param item - Item to insert
 * @returns New array with inserted item
 */
const insertBeforeWhen = <T>(
    arr: T[],
    when: (item: T, i: number) => boolean,
    item: T,
) => {
    const index = arr.findIndex(when);
    return insertAt(arr, index, item);
};

/**
 * Non-mutative
 * Inserts an item after the first element that matches the predicate.
 * @param arr - The input array
 * @param when - Predicate function to find insertion point
 * @param item - Item to insert
 * @returns New array with inserted item
 */
const insertAfterWhen = <T>(
    arr: T[],
    when: (item: T, i: number) => boolean,
    item: T,
) => {
    const index = arr.findIndex(when);
    return insertAt(arr, index + 1, item);
};

/**
 * Mutative
 * Inserts an item at specified index in the array.
 * @param arr - The input array
 * @param index - Position to insert the item
 * @param item - Item to insert
 * @returns The modified array
 */
const insertAtMut = <T>(
    arr: T[],
    index: number,
    item: T,
) => {
    arr.splice(index, 0, item);
    return arr;
};

/**
 * Mutative
 * Inserts an item before the first element that matches the predicate.
 * @param arr - The input array
 * @param when - Predicate function to find insertion point
 * @param item - Item to insert
 * @returns The modified array
 */
const insertBeforeWhenMut = <T>(
    arr: T[],
    when: (item: T, i: number) => boolean,
    item: T,
) => {
    const index = arr.findIndex(when);
    return insertAtMut(arr, index, item);
};

/**
 * Mutative
 * Inserts an item after the first element that matches the predicate.
 * @param arr - The input array
 * @param when - Predicate function to find insertion point
 * @param item - Item to insert
 * @returns The modified array
 */
const insertAfterWhenMut = <T>(
    arr: T[],
    when: (item: T, i: number) => boolean,
    item: T,
) => {
    const index = arr.findIndex(when);
    return insertAtMut(arr, index + 1, item);
};
/**
 * Mutative
 * Swaps two elements in an array based on predicate functions.
 * @param arr - The input array
 * @param whenA - Predicate function to find first element to swap
 * @param whenB - Predicate function to find second element to swap
 * @returns The modified array
 * @throws Error if either element is not found
 */
const swapPositionsWhenMut = <T>(
    arr: T[],
    whenA: (input: T, i: number) => boolean,
    whenB: (input: T, i: number) => boolean,
) => {
    const index1 = arr.findIndex(whenA);
    const index2 = arr.findIndex(whenB);
    if (index1 === -1) {
        throw new Error("Cannot swap if index -1");
    }
    if (index2 === -1) {
        throw new Error("Cannot swap if index -1");
    }

    const temp = arr[index1];
    arr[index1] = arr[index2]!;
    arr[index2] = temp!;
    return arr;
};

/**
 * Mutative
 * Swaps two elements in an array at specified indices.
 * @param arr - The input array
 * @param index1 - Index of first element to swap
 * @param index2 - Index of second element to swap
 * @returns The modified array
 */
const swapPositionsMut = <T>(
    arr: T[],
    index1: number,
    index2: number,
) => {
    const temp = arr[index1];
    arr[index1] = arr[index2]!;
    arr[index2] = temp!;
    return arr;
};

/**
 * Mutative
 * Rotates array left by specified positions.
 * @param arr - The input array
 * @param position - Number of positions to rotate left
 * @returns The modified array
 */
const moveItemLeftMut = <T>(
    arr: T[],
    position: number,
    by: number = 1,
): T[] => {
    let movesLeft = by;
    let currentPosition = position;

    while (movesLeft > 0) {
        const leftItem = arr[currentPosition - 1];
        arr[currentPosition - 1] = arr[currentPosition]!;
        arr[currentPosition] = leftItem!;
        movesLeft--;
        currentPosition--;
    }
    return arr;
};

/**
 * Mutative
 * Rotates array right by specified positions.
 * @param arr - The input array
 * @param positions - Number of positions to rotate right
 * @returns The modified array
 */
const moveItemRightMut = <T>(
    arr: T[],
    positions: number,
    by: number = 1,
) => {
    let movesRight = by;
    let currentPosition = positions;

    while (movesRight > 0) {
        const rightItem = arr[currentPosition + 1];
        arr[currentPosition + 1] = arr[currentPosition]!;
        arr[currentPosition] = rightItem!;
        movesRight--;
        currentPosition++;
    }
    return arr;
};

/**
 * Mutative
 * Moves an item left when condition is met
 * @param arr - The input array
 * @param condition - Function to test array elements
 * @param by - Number of positions to move left
 * @returns The modified array
 */
const moveItemLeftWhenMut = <T>(
    arr: T[],
    condition: (item: T) => boolean,
    by: number = 1,
): T[] => {
    const position = arr.findIndex(condition);
    if (position === -1) {
        throw new Error("Item not found");
    }
    return moveItemLeftMut(arr, position, by);
};

/**
 * Mutative
 * Moves an item right when condition is met
 * @param arr - The input array
 * @param condition - Function to test array elements
 * @param by - Number of positions to move right
 * @returns The modified array
 */
const moveItemRightWhenMut = <T>(
    arr: T[],
    condition: (item: T) => boolean,
    by: number = 1,
): T[] => {
    const position = arr.findIndex(condition);
    if (position === -1) {
        throw new Error("Item not found");
    }
    return moveItemRightMut(arr, position, by);
};

const joinWith = <T>(
    arr: T[],
    cb: (el: T, i: number) => string,
) => {
    let str = "";

    for (let i = 0; i < arr.length; i++) {
        str += cb(arr[i], i);
    }

    return str;
};

export const Arr = {
    joinWith,
    moveItemLeftWhenMut,
    moveItemRightWhenMut,
    swapPositionsWhen,
    swapPositions,
    moveItemLeft,
    moveItemLeftWhen,
    moveItemRight,
    insertAt,
    insertBeforeWhen,
    insertAfterWhen,
    insertAtMut,
    insertBeforeWhenMut,
    insertAfterWhenMut,
    swapPositionsWhenMut,
    swapPositionsMut,
    moveItemLeftMut,
    moveItemRightMut,
};
