export type State<S, A> = {
  run: (s: S) => [A, S];
  map: <B>(f: (a: A) => B) => State<S, B>;
  chain: <B>(f: (a: A) => State<S, B>) => State<S, B>;
  ap: <B>(fb: State<S, (a: A) => B>) => State<S, B>;
};

export const State = <S, A>(run: (s: S) => [A, S]): State<S, A> => ({
  run,
  
  map: (f) =>
    State((s: S) => {
      const [a, s1] = run(s);
      return [f(a), s1];
    }),
    
  chain: (f) =>
    State((s: S) => {
      const [a, s1] = run(s);
      return f(a).run(s1);
    }),
    
  ap: (fb) =>
    State((s: S) => {
      const [fn, s1] = fb.run(s);
      const [a, s2] = run(s1);
      return [fn(a), s2];
    }),
});

/** Static constructors */
State.of = <S, A>(a: A): State<S, A> => 
  State((s) => [a, s]);

State.get = <S>(): State<S, S> => 
  State((s) => [s, s]);

State.put = <S>(s: S): State<S, void> => 
  State(() => [undefined, s]);

State.modify = <S>(f: (s: S) => S): State<S, void> =>
  State((s) => [undefined, f(s)]);

State.gets = <S, A>(f: (s: S) => A): State<S, A> =>
  State((s) => [f(s), s]);

/** Point-free combinators */
State.map = <S, A, B>(f: (a: A) => B) => (st: State<S, A>): State<S, B> =>
  st.map(f);

State.chain = <S, A, B>(f: (a: A) => State<S, B>) => (st: State<S, A>): State<S, B> =>
  st.chain(f);

State.ap = <S, A, B>(fb: State<S, (a: A) => B>) => (fa: State<S, A>): State<S, B> =>
  fa.ap(fb);

State.run = <S, A>(s: S) => (st: State<S, A>): [A, S] =>
  st.run(s);

/** Evaluate - get only the result value */
State.evalState = <S, A>(s: S) => (st: State<S, A>): A =>
  st.run(s)[0];

/** Execute - get only the final state */
State.execState = <S, A>(s: S) => (st: State<S, A>): S =>
  st.run(s)[1];

/** Sequence an array of State computations */
State.sequence = <S, A>(states: State<S, A>[]): State<S, A[]> =>
  State((s) => {
    let currentState = s;
    const values: A[] = [];
    
    for (const st of states) {
      const [a, nextState] = st.run(currentState);
      values.push(a);
      currentState = nextState;
    }
    
    return [values, currentState];
  });

/** Traverse an array */
State.traverse = <S, A, B>(f: (a: A) => State<S, B>) => (arr: A[]): State<S, B[]> =>
  State.sequence(arr.map(f));

export default State;
