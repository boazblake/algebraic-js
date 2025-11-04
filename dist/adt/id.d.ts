export type Id<A> = {
    /** Execute the identity computation */
    run: () => A;
    /** Functor map */
    map: <B>(f: (a: A) => B) => Id<B>;
    /** Monad chain */
    chain: <B>(f: (a: A) => Id<B>) => Id<B>;
    /** Applicative apply */
    ap: <B>(fb: Id<(a: A) => B>) => Id<B>;
};
/** Identity constructor */
export declare const Id: {
    <A>(a: A): Id<A>;
    of<A>(a: A): Id<A>;
    ap<A, B>(fb: Id<(a: A) => B>): (fa: Id<A>) => Id<B>;
    map<A, B>(f: (a: A) => B): (id: Id<A>) => Id<B>;
    chain<A, B>(f: (a: A) => Id<B>): (id: Id<A>) => Id<B>;
    run<A>(id: Id<A>): A;
    extract<A>(id: Id<A>): A;
};
/** Default export object for symmetry with other ADTs */
export default Id;
