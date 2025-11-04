export type Reader<E, A> = {
  run: (env: E) => A;
  map: <B>(f: (a: A) => B) => Reader<E, B>;
  chain: <B>(f: (a: A) => Reader<E, B>) => Reader<E, B>;
  ap: <B>(fb: Reader<E, (a: A) => B>) => Reader<E, B>;
};

/** Reader constructor */
export const Reader = <E, A>(run: (env: E) => A): Reader<E, A> => ({
  run,
  map: (f) => Reader((env: E) => f(run(env))),
  chain: (f) => Reader((env: E) => f(run(env)).run(env)),
  ap: (fb) => Reader((env: E) => fb.run(env)(run(env))),
});

/** Static helpers */
Reader.of = <E, A>(a: A): Reader<E, A> => Reader(() => a);
Reader.ask = <E>(): Reader<E, E> => Reader((env) => env);

/** Access specific part of environment */
Reader.asks = <E, A>(f: (env: E) => A): Reader<E, A> => Reader(f);

/** Point-free combinators */
Reader.map =
  <E, A, B>(f: (a: A) => B) =>
  (r: Reader<E, A>): Reader<E, B> =>
    r.map(f);

Reader.chain =
  <E, A, B>(f: (a: A) => Reader<E, B>) =>
  (r: Reader<E, A>): Reader<E, B> =>
    r.chain(f);

Reader.ap =
  <E, A, B>(fb: Reader<E, (a: A) => B>) =>
  (fa: Reader<E, A>): Reader<E, B> =>
    fa.ap(fb);

Reader.run =
  <E, A>(env: E) =>
  (r: Reader<E, A>): A =>
    r.run(env);

/** Local - run with modified environment */
Reader.local =
  <E, A>(f: (env: E) => E) =>
  (r: Reader<E, A>): Reader<E, A> =>
    Reader((env) => r.run(f(env)));

/** Sequence an array of Readers */
Reader.sequence = <E, A>(readers: Reader<E, A>[]): Reader<E, A[]> =>
  Reader((env) => readers.map((r) => r.run(env)));

/** Traverse an array */
Reader.traverse =
  <E, A, B>(f: (a: A) => Reader<E, B>) =>
  (arr: A[]): Reader<E, B[]> =>
    Reader((env) => arr.map((a) => f(a).run(env)));

/** Unified export */
export default Reader;
