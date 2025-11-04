/** Writer constructor */
export const Writer = (run) => ({
    run,
    map: (f) => Writer(() => {
        const [a, w] = run();
        return [f(a), w];
    }),
    chain: (f) => Writer(() => {
        const [a, w1] = run();
        const [b, w2] = f(a).run();
        const combined = Array.isArray(w1)
            ? [...w1, ...w2]
            : w2;
        return [b, combined];
    }),
    ap: (fb) => Writer(() => {
        const [fn, w1] = fb.run();
        const [a, w2] = run();
        const combined = Array.isArray(w1)
            ? [...w1, ...w2]
            : w2;
        return [fn(a), combined];
    }),
});
/** Static helpers */
Writer.of = (a, empty) => Writer(() => [a, empty]);
Writer.tell = (w) => Writer(() => [undefined, w]);
/** Point-free combinators */
Writer.map = (f) => (w) => w.map(f);
Writer.chain = (f) => (w) => w.chain(f);
Writer.ap = (fb) => (fa) => fa.ap(fb);
Writer.run = (w) => w.run();
/** Extract just the value */
Writer.evalWriter = (w) => w.run()[0];
/** Extract just the log */
Writer.execWriter = (w) => w.run()[1];
/** Listen - get both value and accumulated log */
Writer.listen = (w) => Writer(() => {
    const [a, log] = w.run();
    return [[a, log], log];
});
/** Pass - apply function to log */
Writer.pass = (w) => Writer(() => {
    const [[a, f], log] = w.run();
    return [a, f(log)];
});
/** Censor - transform the log */
Writer.censor = (f) => (w) => Writer(() => {
    const [a, log] = w.run();
    return [a, f(log)];
});
/** Utility for updating + logging (for array logs) */
Writer.updateValueAndLog = (w, message) => w.chain((a) => Writer(() => [a, [message]]));
/** Sequence an array of Writers */
Writer.sequence = (writers) => Writer(() => {
    const values = [];
    let combinedLog;
    writers.forEach((w, i) => {
        const [a, log] = w.run();
        values.push(a);
        if (i === 0) {
            combinedLog = log;
        }
        else if (Array.isArray(combinedLog)) {
            combinedLog = [...combinedLog, ...log];
        }
        else {
            combinedLog = log;
        }
    });
    return [values, combinedLog];
});
/** Traverse an array */
Writer.traverse = (f) => (arr) => Writer.sequence(arr.map(f));
/** Unified object export */
export default Writer;
