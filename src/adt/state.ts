export type State<S, A> = {
  run: (s: S) => [A, S];
  map: <B>(f: (a: A) => B) => State<S, B>;
  chain: <B>(f: (a: A) => State<S, B>) => State<S, B>;
};

type StateConstructor = {
  <S, A>(run: (s: S) => [A, S]): State<S, A>;
  of: <S, A>(a: A) => State<S, A>;
  get: <S>() => State<S, S>;
  put: <S>(s: S) => State<S, void>;
};

export const State = (<S, A>(run: (s: S) => [A, S]) => ({
  run,
  map: <B>(f: (a: A) => B) => State((s: S) => {
    const [a, s1] = run(s);
    return [f(a), s1];
  }),
  chain: <B>(f: (a: A) => State<S, B>) => State((s: S) => {
    const [a, s1] = run(s);
    return f(a).run(s1);
  }),
})) as StateConstructor;

State.of = <S, A>(a: A): State<S, A> => State((s) => [a, s]);
State.get = <S>(): State<S, S> => State((s) => [s, s]);
State.put = <S>(s: S): State<S, void> => State(() => [undefined, s]);
