export type IO<A> = {
  run: () => A;
  map: <B>(f: (a: A) => B) => IO<B>;
  chain: <B>(f: (a: A) => IO<B>) => IO<B>;
};

type IOConstructor = {
  <A>(run: () => A): IO<A>;
  of: <A>(a: A) => IO<A>;
};

export const IO = (<A>(run: () => A): IO<A> => ({
  run,
  map: (f) => IO(() => f(run())),
  chain: (f) => IO(() => f(run()).run()),
})) as IOConstructor;

IO.of = <A>(a: A): IO<A> => IO(() => a);
