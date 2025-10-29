
import { Either, Left, Right } from "./either";

export type Task<E, A> = {
  run: () => Promise<Either<E, A>>;
  map: <B>(f: (a: A) => B) => Task<E, B>;
  chain: <B>(f: (a: A) => Task<E, B>) => Task<E, B>;
};

type TaskConstructor = {
  <E, A>(run: () => Promise<Either<E, A>>): Task<E, A>;
  of: <A>(a: A) => Task<never, A>;
  reject: <E>(e: E) => Task<E, never>;
};


export const Task = (<E, A>(run: () => Promise<Either<E, A>>) => ({
  run,
  map: <B>(f: (a: A) => B): Task<E, B> =>
    Task(() => run().then((ea) => (ea._tag === "Right" ? Right(f(ea.right)) : ea))),
  chain: <B>(f: (a: A) => Task<E, B>): Task<E, B> =>
    Task(() =>
      run().then((ea) =>
        ea._tag === "Right" ? f(ea.right).run() : Promise.resolve(ea)
      )
    ),
})) as TaskConstructor;

Task.of = <A>(a: A): Task<never, A> => Task(() => Promise.resolve(Right(a)));
Task.reject = <E>(e: E): Task<E, never> => Task(() => Promise.resolve(Left(e)));
