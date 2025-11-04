import { Either, Left, Right } from "./either.js";

export type Task<E, A> = {
  run: () => Promise<Either<E, A>>;
  map: <B>(f: (a: A) => B) => Task<E, B>;
  chain: <B>(f: (a: A) => Task<E, B>) => Task<E, B>;
  ap: <B>(fb: Task<E, (a: A) => B>) => Task<E, B>;
  mapError: <E2>(f: (e: E) => E2) => Task<E2, A>;
  bimap: <E2, B>(onError: (e: E) => E2, onSuccess: (a: A) => B) => Task<E2, B>;
};

/** Main constructor */
export const Task = <E, A>(run: () => Promise<Either<E, A>>): Task<E, A> => ({
  run,

  map: <B>(f: (a: A) => B): Task<E, B> =>
    Task(() =>
      run().then((ea) => (ea._tag === "Right" ? Right(f(ea.right)) : ea))
    ),

  chain: <B>(f: (a: A) => Task<E, B>): Task<E, B> =>
    Task(() =>
      run().then((ea) =>
        ea._tag === "Right" ? f(ea.right).run() : Promise.resolve(ea)
      )
    ),

  ap: <B>(fb: Task<E, (a: A) => B>): Task<E, B> =>
    Task(() =>
      fb
        .run()
        .then((ef) =>
          ef._tag === "Right"
            ? run().then((ea) =>
                ea._tag === "Right" ? Right(ef.right(ea.right)) : ea
              )
            : Promise.resolve(ef)
        )
    ),

  mapError: <E2>(f: (e: E) => E2): Task<E2, A> =>
    Task(() =>
      run().then((ea) => (ea._tag === "Left" ? Left(f(ea.left)) : ea))
    ),

  bimap: <E2, B>(onError: (e: E) => E2, onSuccess: (a: A) => B): Task<E2, B> =>
    Task(() =>
      run().then((ea) =>
        ea._tag === "Left" ? Left(onError(ea.left)) : Right(onSuccess(ea.right))
      )
    ),
});

/** Static constructors */
Task.of = <A>(a: A): Task<never, A> => Task(() => Promise.resolve(Right(a)));

Task.reject = <E>(e: E): Task<E, never> => Task(() => Promise.resolve(Left(e)));

/** Utilities */
Task.tryCatch = <A>(f: () => Promise<A>): Task<unknown, A> =>
  Task(() => f().then(Right).catch(Left));

Task.tryCatchK = <E, A>(
  f: () => Promise<A>,
  onError: (e: unknown) => E
): Task<E, A> =>
  Task(() =>
    f()
      .then(Right)
      .catch((e) => Left(onError(e)))
  );

/** Point-free combinators */
Task.map =
  <E, A, B>(f: (a: A) => B) =>
  (t: Task<E, A>): Task<E, B> =>
    t.map(f);

Task.chain =
  <E, A, B>(f: (a: A) => Task<E, B>) =>
  (t: Task<E, A>): Task<E, B> =>
    t.chain(f);

Task.ap =
  <E, A, B>(fb: Task<E, (a: A) => B>) =>
  (fa: Task<E, A>): Task<E, B> =>
    fa.ap(fb);

Task.mapError =
  <E, E2>(f: (e: E) => E2) =>
  <A>(t: Task<E, A>): Task<E2, A> =>
    t.mapError(f);

Task.bimap =
  <E, E2, A, B>(onError: (e: E) => E2, onSuccess: (a: A) => B) =>
  (t: Task<E, A>): Task<E2, B> =>
    t.bimap(onError, onSuccess);

/** Fold - consume the Task */
Task.fold =
  <E, A, B>(onError: (e: E) => B, onSuccess: (a: A) => B) =>
  (t: Task<E, A>): Promise<B> =>
    t
      .run()
      .then((ea) =>
        ea._tag === "Left" ? onError(ea.left) : onSuccess(ea.right)
      );

/** Get Right or default */
Task.getOrElse =
  <E, A>(defaultValue: A) =>
  (t: Task<E, A>): Promise<A> =>
    t.run().then((ea) => (ea._tag === "Right" ? ea.right : defaultValue));

/** Delay execution */
Task.delay =
  (ms: number) =>
  <E, A>(t: Task<E, A>): Task<E, A> =>
    Task(
      () =>
        new Promise((resolve) => setTimeout(() => t.run().then(resolve), ms))
    );

/** Timeout a task */
Task.timeout =
  <E>(ms: number, onTimeout: E) =>
  <A>(t: Task<E, A>): Task<E, A> =>
    Task(() =>
      Promise.race([
        t.run(),
        new Promise<Either<E, A>>((resolve) =>
          setTimeout(() => resolve(Left(onTimeout)), ms)
        ),
      ])
    );

/** Sequence an array of Tasks (sequential execution) */
Task.sequence = <E, A>(tasks: Task<E, A>[]): Task<E, A[]> =>
  Task(async () => {
    const results: A[] = [];
    for (const task of tasks) {
      const ea = await task.run();
      if (ea._tag === "Left") return ea;
      results.push(ea.right);
    }
    return Right(results);
  });

/** Traverse an array */
Task.traverse =
  <E, A, B>(f: (a: A) => Task<E, B>) =>
  (arr: A[]): Task<E, B[]> =>
    Task.sequence(arr.map(f));

/** Parallel execution - all tasks must succeed */
Task.all = <E, A>(tasks: Task<E, A>[]): Task<E, A[]> =>
  Task(async () => {
    const results = await Promise.all(tasks.map((t) => t.run()));
    const values: A[] = [];

    for (const ea of results) {
      if (ea._tag === "Left") return ea;
      values.push(ea.right);
    }

    return Right(values);
  });

/** Race - return first to complete */
Task.race = <E, A>(tasks: Task<E, A>[]): Task<E, A> =>
  Task(() => Promise.race(tasks.map((t) => t.run())));

/** From Either */
Task.fromEither = <E, A>(e: Either<E, A>): Task<E, A> =>
  Task(() => Promise.resolve(e));

/** Convert to Promise (unsafe - throws on Left) */
Task.toPromise = <E, A>(t: Task<E, A>): Promise<A> =>
  t.run().then((ea) => {
    if (ea._tag === "Left") throw ea.left;
    return ea.right;
  });

export default Task;
