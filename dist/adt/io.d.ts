export type IO<A> = {
    run: () => A;
    map: <B>(f: (a: A) => B) => IO<B>;
    chain: <B>(f: (a: A) => IO<B>) => IO<B>;
    ap: <B>(fb: IO<(a: A) => B>) => IO<B>;
};
/** Main constructor */
export declare const IO: {
    <A>(run: () => A): IO<A>;
    of<A>(a: A): IO<A>;
    map<A, B>(f: (a: A) => B): (io: IO<A>) => IO<B>;
    chain<A, B>(f: (a: A) => IO<B>): (io: IO<A>) => IO<B>;
    ap<A, B>(fb: IO<(a: A) => B>): (fa: IO<A>) => IO<B>;
    run<A>(io: IO<A>): A;
    sequence<A>(ios: IO<A>[]): IO<A[]>;
    traverse<A, B>(f: (a: A) => IO<B>): (arr: A[]) => IO<B[]>;
    delay<A>(ms: number, io: IO<A>): IO<A>;
    tryCatch<A>(f: () => A, onError: (e: unknown) => A): IO<A>;
};
/** Aggregate under unified export object */
export default IO;
