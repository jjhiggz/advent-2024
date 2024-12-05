import { Tree } from "./Tree.ts";
import { assertEquals } from "@std/assert";

Deno.test("findNode should work", () => {
    const tree = new Tree(1);
    tree.addChild({
        child: 2,
        toParentFn: (n) => n === 1,
    });
    tree.addChild({
        child: 3,
        toParentFn: (n) => n === 2,
    });
    tree.addChild({
        child: 4,
        toParentFn: (n) => n === 3,
    });
    tree.addChild({
        child: 5,
        toParent: 4,
    });

    const node = tree.findNode((n) => n === 4);

    assertEquals(node?.value, 4);
    assertEquals(node?.children.length, 1);
    assertEquals(node?.children[0].value, 5);

    const nonExistentNode = tree.findNode((n) => n === 10);
    assertEquals(nonExistentNode, null);
});

Deno.test(
    "Should build a family tree and find all ancestors",
    () => {
        const familyTree = new Tree("John");

        familyTree.addChild({
            child: "Mary",
            toParent: "John",
        });
        familyTree.addChild({
            child: "Steve",
            toParent: "John",
        });
        familyTree.addChild({
            child: "Bob",
            toParent: "Mary",
        });
        familyTree.addChild({
            child: "Alice",
            toParent: "Mary",
        });
        familyTree.addChild({
            child: "Carol",
            toParent: "Steve",
        });

        const descendants = familyTree.traverse((node) =>
            node.value
        );

        assertEquals(descendants, [
            "John",
            "Mary",
            "Bob",
            "Alice",
            "Steve",
            "Carol",
        ]);
    },
);

Deno.test("Should calculate total depth of tree", () => {
    const tree = new Tree(1);

    tree.addChild({
        child: 2,
        toParent: 1,
    });
    tree.addChild({
        child: 3,
        toParent: 1,
    });
    tree.addChild({
        child: 4,
        toParent: 2,
    });
    tree.addChild({
        child: 5,
        toParent: 4,
    });

    const maxDepth = tree.traverse((node) => ({
        value: node.value,
        depth: node.children.length
            ? Math.max(
                ...node.children.map((c) =>
                    c.children.length
                ),
            ) + 1
            : 0,
    }))
        .reduce(
            (max, node) => Math.max(max, node.depth),
            0,
        );

    assertEquals(maxDepth, 2);
});

// Deno.test("Should transform tree values and sum them", () => {
//     const tree = new Tree(5);

//     tree.addChild({
//         child: 3,
//         toParent: 5,
//     });
//     tree.addChild({
//         child: 7,
//         toParent: 5,
//     });
//     tree.addChild({
//         child: 2,
//         toParent: 3,
//     });

//     const doubledTree = tree.map((value) => value * 2);
//     const sum = doubledTree.traverse((node) => node.value)
//         .reduce(
//             (acc, val) => acc + val,
//             0,
//         );

//     assertEquals(sum, 54); // (5+3+7+2+4+6) * 2
// });
