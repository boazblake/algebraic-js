export type Reader<E, A> = {
    run: (env: E) => A;
    map: <B>(f: (a: A) => B) => Reader<E, B>;
    chain: <B>(f: (a: A) => Reader<E, B>) => Reader<E, B>;
    ap: <B>(fb: Reader<E, (a: A) => B>) => Reader<E, B>;
};
/** Reader constructor */
export declare const Reader: {
    <E, A>(run: (env: E) => A): Reader<E, A>;
    of<E, A>(a: A): Reader<E, A>;
    ask<E>(): Reader<E, E>;
    asks<E, A>(f: (env: E) => A): Reader<E, A>;
    map<E, A, B>(f: (a: A) => B): (r: Reader<E, A>) => Reader<E, B>;
    chain<E, A, B>(f: (a: A) => Reader<E, B>): (r: Reader<E, A>) => Reader<E, B>;
    ap<E, A, B>(fb: Reader<E, (a: A) => B>): (fa: Reader<E, A>) => Reader<E, B>;
    run<E, A>(env: E): (r: Reader<E, A>) => A;
    local<E, A>(f: (env: E) => E): (r: Reader<E, A>) => Reader<E, A>;
    sequence<E, A>(readers: Reader<E, A>[]): Reader<E, A[]>;
    traverse<E, A, B>(f: (a: A) => Reader<E, B>): (arr: A[]) => Reader<E, B[]>;
};
/** Unified export */
export default Reader;
