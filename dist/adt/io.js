/** Main constructor */
export const IO = (run) => ({
    run,
    map: (f) => IO(() => f(run())),
    chain: (f) => IO(() => f(run()).run()),
    ap: (fb) => IO(() => fb.run()(run())),
});
/** Static pure helper */
IO.of = (a) => IO(() => a);
/** Static combinators (point-free) */
IO.map =
    (f) => (io) => io.map(f);
IO.chain =
    (f) => (io) => io.chain(f);
IO.ap =
    (fb) => (fa) => fa.ap(fb);
IO.run = (io) => io.run();
/** Sequence an array of IOs */
IO.sequence = (ios) => IO(() => ios.map((io) => io.run()));
/** Traverse an array */
IO.traverse =
    (f) => (arr) => IO(() => arr.map((a) => f(a).run()));
/** Delay execution */
IO.delay = (ms, io) => IO(() => {
    const start = Date.now();
    while (Date.now() - start < ms)
        ;
    return io.run();
});
/** Try-catch wrapper */
IO.tryCatch = (f, onError) => IO(() => {
    try {
        return f();
    }
    catch (e) {
        return onError(e);
    }
});
/** Aggregate under unified export object */
export default IO;
