const letters = "abc".split("").flatMap((letter) =>
    "abc".split("").flatMap((l) => `${l}-${letter}`)
);

console.log(letters);
