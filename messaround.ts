import { unzip } from "@std/collections/unzip";
import { pipe, piped } from "remeda";

const text = `
84283   63343
35360   98209
17841   84541
22035   44413
`;
const solution = pipe(
    text.trim().split("\n").map((n) => n.split(/\s+/)),
    unzip,
);

console.log(solution);
