export const State = (run) => ({
    run,
    map: (f) => State((s) => {
        const [a, s1] = run(s);
        return [f(a), s1];
    }),
    chain: (f) => State((s) => {
        const [a, s1] = run(s);
        return f(a).run(s1);
    }),
    ap: (fb) => State((s) => {
        const [fn, s1] = fb.run(s);
        const [a, s2] = run(s1);
        return [fn(a), s2];
    }),
});
/** Static constructors */
State.of = (a) => State((s) => [a, s]);
State.get = () => State((s) => [s, s]);
State.put = (s) => State(() => [undefined, s]);
State.modify = (f) => State((s) => [undefined, f(s)]);
State.gets = (f) => State((s) => [f(s), s]);
/** Point-free combinators */
State.map =
    (f) => (st) => st.map(f);
State.chain =
    (f) => (st) => st.chain(f);
State.ap =
    (fb) => (fa) => fa.ap(fb);
State.run =
    (s) => (st) => st.run(s);
/** Evaluate - get only the result value */
State.evalState =
    (s) => (st) => st.run(s)[0];
/** Execute - get only the final state */
State.execState =
    (s) => (st) => st.run(s)[1];
/** Sequence an array of State computations */
State.sequence = (states) => State((s) => {
    let currentState = s;
    const values = [];
    for (const st of states) {
        const [a, nextState] = st.run(currentState);
        values.push(a);
        currentState = nextState;
    }
    return [values, currentState];
});
/** Traverse an array */
State.traverse =
    (f) => (arr) => State.sequence(arr.map(f));
export default State;
