export type IO<A> = {
  run: () => A;
  map: <B>(f: (a: A) => B) => IO<B>;
  chain: <B>(f: (a: A) => IO<B>) => IO<B>;
  ap: <B>(fb: IO<(a: A) => B>) => IO<B>;
};

/** Main constructor */
export const IO = <A>(run: () => A): IO<A> => ({
  run,
  map: (f) => IO(() => f(run())),
  chain: (f) => IO(() => f(run()).run()),
  ap: (fb) => IO(() => fb.run()(run())),
});

/** Static pure helper */
IO.of = <A>(a: A): IO<A> => IO(() => a);

/** Static combinators (point-free) */
IO.map =
  <A, B>(f: (a: A) => B) =>
  (io: IO<A>): IO<B> =>
    io.map(f);
IO.chain =
  <A, B>(f: (a: A) => IO<B>) =>
  (io: IO<A>): IO<B> =>
    io.chain(f);
IO.ap =
  <A, B>(fb: IO<(a: A) => B>) =>
  (fa: IO<A>): IO<B> =>
    fa.ap(fb);
IO.run = <A>(io: IO<A>): A => io.run();

/** Sequence an array of IOs */
IO.sequence = <A>(ios: IO<A>[]): IO<A[]> => IO(() => ios.map((io) => io.run()));

/** Traverse an array */
IO.traverse =
  <A, B>(f: (a: A) => IO<B>) =>
  (arr: A[]): IO<B[]> =>
    IO(() => arr.map((a) => f(a).run()));

/** Delay execution */
IO.delay = <A>(ms: number, io: IO<A>): IO<A> =>
  IO(() => {
    const start = Date.now();
    while (Date.now() - start < ms);
    return io.run();
  });

/** Try-catch wrapper */
IO.tryCatch = <A>(f: () => A, onError: (e: unknown) => A): IO<A> =>
  IO(() => {
    try {
      return f();
    } catch (e) {
      return onError(e);
    }
  });

/** Aggregate under unified export object */
export default IO;
