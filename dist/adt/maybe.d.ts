export type Just<A> = {
    _tag: "Just";
    value: A;
};
export type Nothing = {
    _tag: "Nothing";
};
export type Maybe<A> = Just<A> | Nothing;
/** Constructors */
export declare const Just: <A>(value: A) => Maybe<A>;
export declare const Nothing: Maybe<never>;
/** Functor map */
export declare const map: <A, B>(f: (a: A) => B, ma: Maybe<A>) => Maybe<B>;
/** Applicative apply */
export declare const ap: <A, B>(mf: Maybe<(a: A) => B>, ma: Maybe<A>) => Maybe<B>;
/** Monad chain */
export declare const chain: <A, B>(f: (a: A) => Maybe<B>, ma: Maybe<A>) => Maybe<B>;
/** Applicative pure */
export declare const of: <A>(a: A) => Maybe<A>;
/** Pattern matching (fold) */
export declare const fold: <A, B>(onNothing: () => B, onJust: (a: A) => B, ma: Maybe<A>) => B;
/** Get value or default */
export declare const getOrElse: <A>(defaultValue: A, ma: Maybe<A>) => A;
/** Get value or compute default */
export declare const getOrElseW: <A, B>(onNothing: () => B, ma: Maybe<A>) => A | B;
/** Alternative - returns first Just */
export declare const alt: <A>(ma1: Maybe<A>, ma2: Maybe<A>) => Maybe<A>;
/** Convert nullable to Maybe */
export declare const fromNullable: <A>(a: A | null | undefined) => Maybe<A>;
/** Convert Maybe to nullable */
export declare const toNullable: <A>(ma: Maybe<A>) => A | null;
/** Convert Maybe to undefined */
export declare const toUndefined: <A>(ma: Maybe<A>) => A | undefined;
/** Check if Maybe is Just */
export declare const isJust: <A>(ma: Maybe<A>) => ma is Just<A>;
/** Check if Maybe is Nothing */
export declare const isNothing: <A>(ma: Maybe<A>) => ma is Nothing;
/** Filter - keep Just only if predicate passes */
export declare const filter: <A>(predicate: (a: A) => boolean, ma: Maybe<A>) => Maybe<A>;
/** Traverse an array */
export declare const traverse: <A, B>(f: (a: A) => Maybe<B>, arr: A[]) => Maybe<B[]>;
/** Sequence an array of Maybes */
export declare const sequence: <A>(arr: Maybe<A>[]) => Maybe<A[]>;
/** Unified static interface */
export declare const Maybe: {
    Just: <A>(value: A) => Maybe<A>;
    Nothing: Nothing;
    map: <A, B>(f: (a: A) => B, ma: Maybe<A>) => Maybe<B>;
    ap: <A, B>(mf: Maybe<(a: A) => B>, ma: Maybe<A>) => Maybe<B>;
    chain: <A, B>(f: (a: A) => Maybe<B>, ma: Maybe<A>) => Maybe<B>;
    of: <A>(a: A) => Maybe<A>;
    fold: <A, B>(onNothing: () => B, onJust: (a: A) => B, ma: Maybe<A>) => B;
    getOrElse: <A>(defaultValue: A, ma: Maybe<A>) => A;
    getOrElseW: <A, B>(onNothing: () => B, ma: Maybe<A>) => A | B;
    alt: <A>(ma1: Maybe<A>, ma2: Maybe<A>) => Maybe<A>;
    fromNullable: <A>(a: A | null | undefined) => Maybe<A>;
    toNullable: <A>(ma: Maybe<A>) => A | null;
    toUndefined: <A>(ma: Maybe<A>) => A | undefined;
    isJust: <A>(ma: Maybe<A>) => ma is Just<A>;
    isNothing: <A>(ma: Maybe<A>) => ma is Nothing;
    filter: <A>(predicate: (a: A) => boolean, ma: Maybe<A>) => Maybe<A>;
    traverse: <A, B>(f: (a: A) => Maybe<B>, arr: A[]) => Maybe<B[]>;
    sequence: <A>(arr: Maybe<A>[]) => Maybe<A[]>;
};
export default Maybe;
