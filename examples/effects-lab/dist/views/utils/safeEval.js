export const safeEval = (src) => {
    try {
        return new Function("x", `return (${src})(x);`);
    }
    catch {
        throw new Error("Invalid function syntax");
    }
};
