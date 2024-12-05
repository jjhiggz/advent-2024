import { Arr } from "./Array.ts";
import { assertEquals } from "@std/assert";

Deno.test("Should swap positions when conditions are met", () => {
    const arr = [1, 2, 3, 4, 5];
    const result = Arr.swapPositionsWhen(
        arr,
        (n) => n === 2,
        (n) => n === 4,
    );
    assertEquals(result, [1, 4, 3, 2, 5]);
});

Deno.test("Should swap positions by index", () => {
    const arr = [1, 2, 3, 4, 5];
    const result = Arr.swapPositions(arr, 1, 3);
    assertEquals(result, [1, 4, 3, 2, 5]);
});

Deno.test(
    "Should move item in array left by index",
    () => {
        const arr = [1, 2, 3, 4, 5, 6];
        const result = Arr.moveItemLeft(arr, 3, 2);
        assertEquals(result, [1, 4, 2, 3, 5, 6]);
    },
);

Deno.test(
    "Should move item in array left by index with by 1",
    () => {
        const arr = [1, 2, 3, 4, 5, 6];
        const result = Arr.moveItemLeft(arr, 3, 1);
        assertEquals(result, [1, 2, 4, 3, 5, 6]);
    },
);

Deno.test("Should rotate array right by index", () => {
    const arr = [1, 2, 3, 4, 5, 6];
    const result = Arr.moveItemRight(arr, 2, 2);
    assertEquals(result, [1, 2, 4, 5, 3, 6]);
});

Deno.test("Should rotate array right by index with default by 1", () => {
    const arr = [1, 2, 3, 4, 5, 6];
    const result = Arr.moveItemRight(arr, 2);
    assertEquals(result, [1, 2, 4, 3, 5, 6]);
});

Deno.test("Should insert item at index", () => {
    const arr = [1, 2, 3, 4, 5];
    const result = Arr.insertAt(arr, 2, 10);
    assertEquals(result, [1, 2, 10, 3, 4, 5]);
});

Deno.test("Should insert item before condition is met", () => {
    const arr = [1, 2, 3, 4, 5];
    const result = Arr.insertBeforeWhen(
        arr,
        (n) => n === 3,
        10,
    );
    assertEquals(result, [1, 2, 10, 3, 4, 5]);
});

Deno.test("Should insert item after condition is met", () => {
    const arr = [1, 2, 3, 4, 5];
    const result = Arr.insertAfterWhen(
        arr,
        (n) => n === 3,
        10,
    );
    assertEquals(result, [1, 2, 3, 10, 4, 5]);
});

Deno.test("Should throw error when swap position not found", () => {
    const arr = [1, 2, 3, 4, 5];
    try {
        Arr.swapPositionsWhen(
            arr,
            (n) => n === 10,
            (n) => n === 20,
        );
    } catch (e) {
        assertEquals(
            (e as Error).message,
            "Cannot swap if index -1",
        );
    }
});

Deno.test("Should mutatively insert item at index", () => {
    const arr = [1, 2, 3, 4, 5];
    const result = Arr.insertAtMut(arr, 2, 10);
    assertEquals(result, [1, 2, 10, 3, 4, 5]);
    assertEquals(arr, [1, 2, 10, 3, 4, 5]); // Verify original array was mutated
});

Deno.test("Should mutatively insert item before condition is met", () => {
    const arr = [1, 2, 3, 4, 5];
    const result = Arr.insertBeforeWhenMut(
        arr,
        (n) => n === 3,
        10,
    );
    assertEquals(result, [1, 2, 10, 3, 4, 5]);
    assertEquals(arr, [1, 2, 10, 3, 4, 5]); // Verify original array was mutated
});

Deno.test("Should mutatively insert item after condition is met", () => {
    const arr = [1, 2, 3, 4, 5];
    const result = Arr.insertAfterWhenMut(
        arr,
        (n) => n === 3,
        10,
    );
    assertEquals(result, [1, 2, 3, 10, 4, 5]);
    assertEquals(arr, [1, 2, 3, 10, 4, 5]); // Verify original array was mutated
});

Deno.test("Should mutatively swap positions when conditions are met", () => {
    const arr = [1, 2, 3, 4, 5];
    const result = Arr.swapPositionsWhenMut(
        arr,
        (n) => n === 2,
        (n) => n === 4,
    );
    assertEquals(result, [1, 4, 3, 2, 5]);
    assertEquals(arr, [1, 4, 3, 2, 5]); // Verify original array was mutated
});

Deno.test("Should throw error when mutative swap position not found", () => {
    const arr = [1, 2, 3, 4, 5];
    try {
        Arr.swapPositionsWhenMut(
            arr,
            (n) => n === 10,
            (n) => n === 20,
        );
    } catch (e) {
        assertEquals(
            (e as Error).message,
            "Cannot swap if index -1",
        );
    }
});

Deno.test("Should mutatively swap positions at indices", () => {
    const arr = [1, 2, 3, 4, 5];
    const result = Arr.swapPositionsMut(arr, 1, 3);
    assertEquals(result, [1, 4, 3, 2, 5]);
    assertEquals(arr, [1, 4, 3, 2, 5]); // Verify original array was mutated
});

Deno.test(
    "Should mutatively rotate array left by positions",
    () => {
        const arr = [1, 2, 3, 4, 5];
        const result = Arr.moveItemLeftMut(arr, 2);

        assertEquals(result, [1, 3, 2, 4, 5]);
        assertEquals(result, [1, 3, 2, 4, 5]);
    },
);

Deno.test(
    "Should mutatively rotate array left by 3 positions",
    () => {
        const arr = [1, 2, 3, 4, 5, 6];
        const result = Arr.moveItemLeftMut(arr, 4, 3);

        assertEquals(result, [1, 5, 2, 3, 4, 6]);
        assertEquals(arr, [1, 5, 2, 3, 4, 6]); // Verify original array was mutated
    },
);

Deno.test("Should mutatively rotate array right by positions", () => {
    const arr = [1, 2, 3, 4, 5];
    const result = Arr.moveItemRightMut(arr, 2);
    assertEquals(result, [1, 2, 4, 3, 5]);
    assertEquals(arr, [1, 2, 4, 3, 5]); // Verify original array was mutated
});

Deno.test(
    "Should mutatively rotate array right by positions",
    () => {
        const arr = [1, 2, 3, 4, 5];
        const result = Arr.moveItemRightMut(arr, 1, 2);
        assertEquals(result, [1, 3, 4, 2, 5]);
        assertEquals(arr, [1, 3, 4, 2, 5]); // Verify original array was mutated
    },
);

Deno.test("Should rotate array left when condition is met", () => {
    const arr = [1, 2, 3, 4, 5];
    const result = Arr.moveItemLeftWhen(
        arr,
        (n) => n === 3,
    );
    assertEquals(result, [1, 3, 2, 4, 5]);
    assertEquals(arr, [1, 2, 3, 4, 5]);
});
