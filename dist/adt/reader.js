/** Reader constructor */
export const Reader = (run) => ({
    run,
    map: (f) => Reader((env) => f(run(env))),
    chain: (f) => Reader((env) => f(run(env)).run(env)),
    ap: (fb) => Reader((env) => fb.run(env)(run(env))),
});
/** Static helpers */
Reader.of = (a) => Reader(() => a);
Reader.ask = () => Reader((env) => env);
/** Access specific part of environment */
Reader.asks = (f) => Reader(f);
/** Point-free combinators */
Reader.map =
    (f) => (r) => r.map(f);
Reader.chain =
    (f) => (r) => r.chain(f);
Reader.ap =
    (fb) => (fa) => fa.ap(fb);
Reader.run =
    (env) => (r) => r.run(env);
/** Local - run with modified environment */
Reader.local =
    (f) => (r) => Reader((env) => r.run(f(env)));
/** Sequence an array of Readers */
Reader.sequence = (readers) => Reader((env) => readers.map((r) => r.run(env)));
/** Traverse an array */
Reader.traverse =
    (f) => (arr) => Reader((env) => arr.map((a) => f(a).run(env)));
/** Unified export */
export default Reader;
