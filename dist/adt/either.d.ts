export type Left<L> = {
    _tag: "Left";
    left: L;
};
export type Right<R> = {
    _tag: "Right";
    right: R;
};
export type Either<L, R> = Left<L> | Right<R>;
/** Constructors */
export declare const Left: <L>(l: L) => Either<L, never>;
export declare const Right: <R>(r: R) => Either<never, R>;
/** Functor map */
export declare const map: <L, A, B>(f: (a: A) => B, e: Either<L, A>) => Either<L, B>;
/** Applicative apply */
export declare const ap: <L, A, B>(ef: Either<L, (a: A) => B>, ea: Either<L, A>) => Either<L, B>;
/** Monad chain */
export declare const chain: <L, A, B>(f: (a: A) => Either<L, B>, e: Either<L, A>) => Either<L, B>;
/** Bifunctor bimap */
export declare const bimap: <L, A, L2, B>(onLeft: (l: L) => L2, onRight: (a: A) => B, e: Either<L, A>) => Either<L2, B>;
/** Map over Left */
export declare const mapLeft: <L, A, L2>(f: (l: L) => L2, e: Either<L, A>) => Either<L2, A>;
/** Fold (pattern match) */
export declare const fold: <L, A, B>(onLeft: (l: L) => B, onRight: (a: A) => B, e: Either<L, A>) => B;
/** Applicative */
export declare const of: <A>(a: A) => Either<never, A>;
/** Get Right or default */
export declare const getOrElse: <L, A>(defaultValue: A, e: Either<L, A>) => A;
/** Get Right or compute default */
export declare const getOrElseW: <L, A, B>(onLeft: (l: L) => B, e: Either<L, A>) => A | B;
/** Alternative - returns first Right */
export declare const alt: <L, A>(e1: Either<L, A>, e2: Either<L, A>) => Either<L, A>;
/** Check if Either is Left */
export declare const isLeft: <L, A>(e: Either<L, A>) => e is Left<L>;
/** Check if Either is Right */
export declare const isRight: <L, A>(e: Either<L, A>) => e is Right<A>;
/** Convert nullable to Either */
export declare const fromNullable: <L>(onNull: L) => <A>(a: A | null | undefined) => Either<L, A>;
/** Try-catch wrapper */
export declare const tryCatch: <A>(f: () => A) => Either<unknown, A>;
/** Try-catch with error mapper */
export declare const tryCatchK: <E, A>(f: () => A, onError: (e: unknown) => E) => Either<E, A>;
/** Swap Left and Right */
export declare const swap: <L, A>(e: Either<L, A>) => Either<A, L>;
/** Filter Right - converts to Left if predicate fails */
export declare const filterOrElse: <L, A>(predicate: (a: A) => boolean, onFalse: (a: A) => L, e: Either<L, A>) => Either<L, A>;
/** Traverse an array */
export declare const traverse: <L, A, B>(f: (a: A) => Either<L, B>, arr: A[]) => Either<L, B[]>;
/** Sequence an array of Eithers */
export declare const sequence: <L, A>(arr: Either<L, A>[]) => Either<L, A[]>;
/** Combine as a single runtime object */
export declare const Either: {
    Left: <L>(l: L) => Either<L, never>;
    Right: <R>(r: R) => Either<never, R>;
    map: <L, A, B>(f: (a: A) => B, e: Either<L, A>) => Either<L, B>;
    ap: <L, A, B>(ef: Either<L, (a: A) => B>, ea: Either<L, A>) => Either<L, B>;
    chain: <L, A, B>(f: (a: A) => Either<L, B>, e: Either<L, A>) => Either<L, B>;
    bimap: <L, A, L2, B>(onLeft: (l: L) => L2, onRight: (a: A) => B, e: Either<L, A>) => Either<L2, B>;
    mapLeft: <L, A, L2>(f: (l: L) => L2, e: Either<L, A>) => Either<L2, A>;
    fold: <L, A, B>(onLeft: (l: L) => B, onRight: (a: A) => B, e: Either<L, A>) => B;
    of: <A>(a: A) => Either<never, A>;
    getOrElse: <L, A>(defaultValue: A, e: Either<L, A>) => A;
    getOrElseW: <L, A, B>(onLeft: (l: L) => B, e: Either<L, A>) => A | B;
    alt: <L, A>(e1: Either<L, A>, e2: Either<L, A>) => Either<L, A>;
    isLeft: <L, A>(e: Either<L, A>) => e is Left<L>;
    isRight: <L, A>(e: Either<L, A>) => e is Right<A>;
    fromNullable: <L>(onNull: L) => <A>(a: A | null | undefined) => Either<L, A>;
    tryCatch: <A>(f: () => A) => Either<unknown, A>;
    tryCatchK: <E, A>(f: () => A, onError: (e: unknown) => E) => Either<E, A>;
    swap: <L, A>(e: Either<L, A>) => Either<A, L>;
    filterOrElse: <L, A>(predicate: (a: A) => boolean, onFalse: (a: A) => L, e: Either<L, A>) => Either<L, A>;
    traverse: <L, A, B>(f: (a: A) => Either<L, B>, arr: A[]) => Either<L, B[]>;
    sequence: <L, A>(arr: Either<L, A>[]) => Either<L, A[]>;
};
export default Either;
