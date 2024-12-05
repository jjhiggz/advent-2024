/**
 * Creates a new RegExp by composing an existing regex pattern with flags
 * @param pattern The regex pattern from Reg to use
 * @param flags The flags to apply (e.g. 'g', 'i', 'm', etc)
 * @returns A new RegExp with the specified flags
 */
export const withFlags = (
    pattern: RegExp,
    flags: string,
): RegExp => new RegExp(pattern.source, flags);

export const Reg = {
    withFlags,
    whitespace: /\s+/,
    integer: /-?\d+/,
    number: /-?\d+(\.\d+)?/,
    decimalNumber: /-?\d+\.\d+/,
    /** @deprecated */
    // positiveNumber: /-?\d+(\.\d+)?/,
    positiveNumber: /\d*(\.d*)?/,
    negativeNumber: /^-\d+(\.\d+)?/,
    doubleLineBreak: /\n\n/,
    lineBreak: /\n/,
    insideBrackets: /\[.*?\]/,
    insideParentheses: /\(.*?\)/,
    insideCurlyBrackets: /\{.*?\}/,
    insideAngleBrackets: /<.*?>/,
};
