import { assertEquals } from "@std/assert";
import { Reg } from "./Regex.ts";

Deno.test("Regex.whitespace matches whitespace characters", () => {
    const tests = [
        { input: " ", expected: true },
        { input: "\t", expected: true },
        { input: "\n", expected: true },
        { input: "a", expected: false },
        { input: "1", expected: false },
    ];

    tests.forEach(({ input, expected }) => {
        assertEquals(
            Reg.whitespace.test(input),
            expected,
        );
    });
});

Deno.test(
    "Regex.number matches numbers (float or integer)",
    () => {
        const tests = [
            { input: "123", expected: true },
            { input: "-123", expected: true },
            { input: "0", expected: true },
            { input: "abc", expected: false },
            { input: "12.34", expected: true },
        ];

        tests.forEach(({ input, expected }) => {
            assertEquals(
                Reg.number.test(input),
                expected,
            );
        });
    },
);

Deno.test("Regex.integer matches integers", () => {
    const tests = [
        { input: "123", expected: true },
        { input: "-123", expected: true },
        { input: "0", expected: true },
        { input: "abc", expected: false },
    ];

    tests.forEach(({ input, expected }) => {
        assertEquals(Reg.integer.test(input), expected);
    });
});

Deno.test("Regex.decimalNumber matches decimal numbers", () => {
    const tests = [
        { input: "123.45", expected: true },
        { input: "-123.45", expected: true },
        { input: "0.0", expected: true },
        { input: "123", expected: false },
        { input: "abc", expected: false },
    ];

    tests.forEach(({ input, expected }) => {
        assertEquals(
            Reg.decimalNumber.test(input),
            expected,
        );
    });
});

Deno.test("Regex.negativeNumber matches negative numbers", () => {
    const tests = [
        { input: "-123", expected: true },
        { input: "123", expected: false },
        { input: "0", expected: false },
        { input: "-12.34", expected: true },
        { input: "abc", expected: false },
    ];

    tests.forEach(({ input, expected }) => {
        assertEquals(
            Reg.negativeNumber.test(input),
            expected,
        );
    });
});

Deno.test("Regex.doubleLineBreak matches double line breaks", () => {
    const tests = [
        { input: "\n\n", expected: true },
        { input: "\n", expected: false },
        { input: "\\n\\n", expected: false },
    ];

    tests.forEach(({ input, expected }) => {
        assertEquals(
            Reg.doubleLineBreak.test(input),
            expected,
        );
    });
});

Deno.test("Regex.lineBreak matches single line breaks", () => {
    const tests = [
        { input: "\n", expected: true },
        { input: "\\n", expected: false },
        { input: " ", expected: false },
    ];

    tests.forEach(({ input, expected }) => {
        assertEquals(Reg.lineBreak.test(input), expected);
    });
});

Deno.test("Regex.insideBrackets matches content within brackets", () => {
    const tests = [
        { input: "[test]", expected: true },
        { input: "[]", expected: true },
        { input: "[nested[brackets]]", expected: true },
        { input: "test", expected: false },
    ];

    tests.forEach(({ input, expected }) => {
        assertEquals(
            Reg.insideBrackets.test(input),
            expected,
        );
    });
});

Deno.test("Regex.insideParentheses matches content within parentheses", () => {
    const tests = [
        { input: "(test)", expected: true },
        { input: "()", expected: true },
        { input: "(nested(parens))", expected: true },
        { input: "test", expected: false },
    ];

    tests.forEach(({ input, expected }) => {
        assertEquals(
            Reg.insideParentheses.test(input),
            expected,
        );
    });
});

Deno.test("Regex.insideCurlyBrackets matches content within curly brackets", () => {
    const tests = [
        { input: "{test}", expected: true },
        { input: "{}", expected: true },
        { input: "{nested{braces}}", expected: true },
        { input: "test", expected: false },
    ];

    tests.forEach(({ input, expected }) => {
        assertEquals(
            Reg.insideCurlyBrackets.test(input),
            expected,
        );
    });
});

Deno.test("Regex.insideAngleBrackets matches content within angle brackets", () => {
    const tests = [
        { input: "<test>", expected: true },
        { input: "<>", expected: true },
        { input: "<nested<brackets>>", expected: true },
        { input: "test", expected: false },
    ];

    tests.forEach(({ input, expected }) => {
        assertEquals(
            Reg.insideAngleBrackets.test(input),
            expected,
        );
    });
});

Deno.test("Regex.withFlags creates a new RegExp with flags", () => {
    const pattern = Reg.whitespace;
    const flags = "g";
    const result = Reg.withFlags(pattern, flags);
    assertEquals(result.flags, flags);
});

Deno.test("Regex with flags works to globally match whitespace", () => {
    const pattern = Reg.whitespace;
    const flags = "g";
    const input = "a b c";
    const result = Reg.withFlags(pattern, flags);
    const matches = input.match(result);
    assertEquals(matches?.length, 2);
});
