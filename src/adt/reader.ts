export type Reader<E, A> = {
  run: (env: E) => A;
  map: <B>(f: (a: A) => B) => Reader<E, B>;
  chain: <B>(f: (a: A) => Reader<E, B>) => Reader<E, B>;
};

type ReaderConstructor = {
  <E, A>(run: (env: E) => A): Reader<E, A>;
  ask: <E>() => Reader<E, E>;
  of: <E, A>(a: A) => Reader<E, A>;
};

export const Reader = (<E, A>(run: (env: E) => A) => ({
  run,
  map: <B>(f: (a: A) => B) => Reader((env: E) => f(run(env))),
  chain: <B>(f: (a: A) => Reader<E, B>) => Reader((env: E) => f(run(env)).run(env)),
})) as ReaderConstructor;

Reader.of = <E, A>(a: A): Reader<E, A> => Reader(() => a);
Reader.ask = <E>(): Reader<E, E> => Reader((env) => env);
