import { Either } from "./either.js";
export type Task<E, A> = {
    run: () => Promise<Either<E, A>>;
    map: <B>(f: (a: A) => B) => Task<E, B>;
    chain: <B>(f: (a: A) => Task<E, B>) => Task<E, B>;
    ap: <B>(fb: Task<E, (a: A) => B>) => Task<E, B>;
    mapError: <E2>(f: (e: E) => E2) => Task<E2, A>;
    bimap: <E2, B>(onError: (e: E) => E2, onSuccess: (a: A) => B) => Task<E2, B>;
};
/** Main constructor */
export declare const Task: {
    <E, A>(run: () => Promise<Either<E, A>>): Task<E, A>;
    of<A>(a: A): Task<never, A>;
    reject<E>(e: E): Task<E, never>;
    tryCatch<A>(f: () => Promise<A>): Task<unknown, A>;
    tryCatchK<E, A>(f: () => Promise<A>, onError: (e: unknown) => E): Task<E, A>;
    map<E, A, B>(f: (a: A) => B): (t: Task<E, A>) => Task<E, B>;
    chain<E, A, B>(f: (a: A) => Task<E, B>): (t: Task<E, A>) => Task<E, B>;
    ap<E, A, B>(fb: Task<E, (a: A) => B>): (fa: Task<E, A>) => Task<E, B>;
    mapError<E, E2>(f: (e: E) => E2): <A>(t: Task<E, A>) => Task<E2, A>;
    bimap<E, E2, A, B>(onError: (e: E) => E2, onSuccess: (a: A) => B): (t: Task<E, A>) => Task<E2, B>;
    fold<E, A, B>(onError: (e: E) => B, onSuccess: (a: A) => B): (t: Task<E, A>) => Promise<B>;
    getOrElse<E, A>(defaultValue: A): (t: Task<E, A>) => Promise<A>;
    delay(ms: number): <E, A>(t: Task<E, A>) => Task<E, A>;
    timeout<E>(ms: number, onTimeout: E): <A>(t: Task<E, A>) => Task<E, A>;
    sequence<E, A>(tasks: Task<E, A>[]): Task<E, A[]>;
    traverse<E, A, B>(f: (a: A) => Task<E, B>): (arr: A[]) => Task<E, B[]>;
    all<E, A>(tasks: Task<E, A>[]): Task<E, A[]>;
    race<E, A>(tasks: Task<E, A>[]): Task<E, A>;
    fromEither<E, A>(e: Either<E, A>): Task<E, A>;
    toPromise<E, A>(t: Task<E, A>): Promise<A>;
};
export default Task;
