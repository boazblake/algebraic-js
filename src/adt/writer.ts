export type Writer<W, A> = {
  run: () => [A, W];
  map: <B>(f: (a: A) => B) => Writer<W, B>;
  chain: <B>(f: (a: A) => Writer<W, B>) => Writer<W, B>;
  ap: <B>(fb: Writer<W, (a: A) => B>) => Writer<W, B>;
};

/** Writer constructor */
export const Writer = <W, A>(run: () => [A, W]): Writer<W, A> => ({
  run,
  
  map: <B>(f: (a: A) => B): Writer<W, B> =>
    Writer(() => {
      const [a, w] = run();
      return [f(a), w];
    }),

  chain: <B>(f: (a: A) => Writer<W, B>): Writer<W, B> =>
    Writer(() => {
      const [a, w1] = run();
      const [b, w2] = f(a).run();
      const combined = Array.isArray(w1)
        ? ([...(w1 as any), ...(w2 as any)] as any as W)
        : (w2 as W);
      return [b, combined];
    }),

  ap: <B>(fb: Writer<W, (a: A) => B>): Writer<W, B> =>
    Writer(() => {
      const [fn, w1] = fb.run();
      const [a, w2] = run();
      const combined = Array.isArray(w1)
        ? ([...(w1 as any), ...(w2 as any)] as any as W)
        : (w2 as W);
      return [fn(a), combined];
    }),
});

/** Static helpers */
Writer.of = <W, A>(a: A, empty: W): Writer<W, A> => 
  Writer(() => [a, empty]);

Writer.tell = <W>(w: W): Writer<W, void> => 
  Writer(() => [undefined, w]);

/** Point-free combinators */
Writer.map = <W, A, B>(f: (a: A) => B) => (w: Writer<W, A>): Writer<W, B> =>
  w.map(f);

Writer.chain = <W, A, B>(f: (a: A) => Writer<W, B>) => (w: Writer<W, A>): Writer<W, B> =>
  w.chain(f);

Writer.ap = <W, A, B>(fb: Writer<W, (a: A) => B>) => (fa: Writer<W, A>): Writer<W, B> =>
  fa.ap(fb);

Writer.run = <W, A>(w: Writer<W, A>): [A, W] => 
  w.run();

/** Extract just the value */
Writer.evalWriter = <W, A>(w: Writer<W, A>): A => 
  w.run()[0];

/** Extract just the log */
Writer.execWriter = <W, A>(w: Writer<W, A>): W => 
  w.run()[1];

/** Listen - get both value and accumulated log */
Writer.listen = <W, A>(w: Writer<W, A>): Writer<W, [A, W]> =>
  Writer(() => {
    const [a, log] = w.run();
    return [[a, log], log];
  });

/** Pass - apply function to log */
Writer.pass = <W, A>(w: Writer<W, [A, (w: W) => W]>): Writer<W, A> =>
  Writer(() => {
    const [[a, f], log] = w.run();
    return [a, f(log)];
  });

/** Censor - transform the log */
Writer.censor = <W, A>(f: (w: W) => W) => (w: Writer<W, A>): Writer<W, A> =>
  Writer(() => {
    const [a, log] = w.run();
    return [a, f(log)];
  });

/** Utility for updating + logging (for array logs) */
Writer.updateValueAndLog = <A>(
  w: Writer<string[], A>,
  message: string
): Writer<string[], A> =>
  w.chain((a) => Writer(() => [a, [message]]));

/** Sequence an array of Writers */
Writer.sequence = <W, A>(writers: Writer<W, A>[]): Writer<W, A[]> =>
  Writer(() => {
    const values: A[] = [];
    let combinedLog: W;
    
    writers.forEach((w, i) => {
      const [a, log] = w.run();
      values.push(a);
      if (i === 0) {
        combinedLog = log;
      } else if (Array.isArray(combinedLog)) {
        combinedLog = [...(combinedLog as any), ...(log as any)] as any;
      } else {
        combinedLog = log;
      }
    });
    
    return [values, combinedLog!];
  });

/** Traverse an array */
Writer.traverse = <W, A, B>(f: (a: A) => Writer<W, B>) => (arr: A[]): Writer<W, B[]> =>
  Writer.sequence(arr.map(f));

/** Unified object export */
export default Writer;
