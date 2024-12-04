type TreeNode<T> = {
    value: T;
    children: TreeNode<T>[];
};

type Nullish = null | undefined;

export const findAndReplaceWith = <T, Return>(
    data: T[],
    callback: (input: T) => Return | Nullish,
) => {
    for (const el of data) {
        const result = callback(el);
        if (result) return result;
    }
};

export class Tree<T> {
    private root: TreeNode<T> | null = null;

    constructor(rootValue?: T) {
        this.root = rootValue
            ? { value: rootValue, children: [] }
            : null;
    }

    addChild = (
        params: {
            child: T;
            toParentFn?: (input: T) => boolean;
        } | { child: T; toParent: T },
    ) => {
        const parent = "toParentFn" in params
            ? params.toParentFn
                ? this.findNode(params.toParentFn)
                : null
            //@ts-expect-error too lazy
            : this.findNode((n) => n === params.toParent);

        if (!parent) throw new Error("Could not addChild");

        parent.children.push({
            value: params.child,
            children: [],
        });
    };

    findNode = (
        by: (input: T) => boolean,
        offOfNode = this.root,
    ): TreeNode<T> | null => {
        if (!offOfNode) return null;

        return by(offOfNode.value)
            ? offOfNode
            : findAndReplaceWith(
                offOfNode.children,
                (node) => this.findNode(by, node),
            ) ?? null;
    };

    traverse = <R>(cb: (node: TreeNode<T>) => R): R[] => {
        if (!this.root) return [];

        const results: R[] = [];
        const visit = (node: TreeNode<T>) => {
            results.push(cb(node));
            node.children.forEach(visit);
        };

        visit(this.root);
        return results;
    };

    map = <R>(cb: (value: T) => R): Tree<R> => {
        const newTree = new Tree<R>();
        if (!this.root) return newTree;

        const mapNode = (
            node: TreeNode<T>,
        ): TreeNode<R> => ({
            value: cb(node.value),
            children: node.children.map(mapNode),
        });

        newTree.root = mapNode(this.root);
        return newTree;
    };

    // reduce = <R>(
    //     cb: (acc: R, value: T) => R,
    //     initial: R,
    // ): R => {
    //     if (!this.root) return initial;

    //     return this.traverse((node) => node.value)
    //         .reduce(cb, initial);
    // };

    print = (
        valueTransform?: (value: T) => string,
    ): void => {
        if (!this.root) {
            console.log("Empty tree");
            return;
        }

        const printNode = (
            node: TreeNode<T>,
            prefix = "",
            isLast = true,
        ): void => {
            const displayValue = valueTransform
                ? valueTransform(node.value)
                : String(node.value);

            console.log(
                `${prefix}${
                    isLast ? "└── " : "├── "
                }${displayValue}`,
            );

            const childPrefix = prefix +
                (isLast ? "    " : "│   ");

            node.children.forEach((child, index) => {
                printNode(
                    child,
                    childPrefix,
                    index === node.children.length - 1,
                );
            });
        };

        const displayValue = valueTransform
            ? valueTransform(this.root.value)
            : String(this.root.value);

        console.log(displayValue);
        this.root.children.forEach((child, index) => {
            printNode(
                child,
                "",
                index ===
                    (this.root?.children?.length ?? 0) - 1,
            );
        });
    };
}
