/** Constructors */
export const Left = (l) => ({ _tag: "Left", left: l });
export const Right = (r) => ({ _tag: "Right", right: r });
/** Functor map */
export const map = (f, e) => (e._tag === "Right" ? Right(f(e.right)) : e);
/** Applicative apply */
export const ap = (ef, ea) => {
    if (ef._tag === "Left")
        return Left(ef.left);
    if (ea._tag === "Left")
        return Left(ea.left);
    return Right(ef.right(ea.right));
};
/** Monad chain */
export const chain = (f, e) => (e._tag === "Right" ? f(e.right) : e);
/** Bifunctor bimap */
export const bimap = (onLeft, onRight, e) => e._tag === "Left" ? Left(onLeft(e.left)) : Right(onRight(e.right));
/** Map over Left */
export const mapLeft = (f, e) => (e._tag === "Left" ? Left(f(e.left)) : e);
/** Fold (pattern match) */
export const fold = (onLeft, onRight, e) => (e._tag === "Left" ? onLeft(e.left) : onRight(e.right));
/** Applicative */
export const of = (a) => Right(a);
/** Get Right or default */
export const getOrElse = (defaultValue, e) => (e._tag === "Right" ? e.right : defaultValue);
/** Get Right or compute default */
export const getOrElseW = (onLeft, e) => (e._tag === "Right" ? e.right : onLeft(e.left));
/** Alternative - returns first Right */
export const alt = (e1, e2) => (e1._tag === "Right" ? e1 : e2);
/** Check if Either is Left */
export const isLeft = (e) => e._tag === "Left";
/** Check if Either is Right */
export const isRight = (e) => e._tag === "Right";
/** Convert nullable to Either */
export const fromNullable = (onNull) => (a) => (a == null ? Left(onNull) : Right(a));
/** Try-catch wrapper */
export const tryCatch = (f) => {
    try {
        return Right(f());
    }
    catch (e) {
        return Left(e);
    }
};
/** Try-catch with error mapper */
export const tryCatchK = (f, onError) => {
    try {
        return Right(f());
    }
    catch (e) {
        return Left(onError(e));
    }
};
/** Swap Left and Right */
export const swap = (e) => e._tag === "Left" ? Right(e.left) : Left(e.right);
/** Filter Right - converts to Left if predicate fails */
export const filterOrElse = (predicate, onFalse, e) => e._tag === "Right" && !predicate(e.right) ? Left(onFalse(e.right)) : e;
/** Traverse an array */
export const traverse = (f, arr) => {
    const result = [];
    for (const a of arr) {
        const eb = f(a);
        if (eb._tag === "Left")
            return eb;
        result.push(eb.right);
    }
    return Right(result);
};
/** Sequence an array of Eithers */
export const sequence = (arr) => traverse((x) => x, arr);
/** Combine as a single runtime object */
export const Either = {
    Left,
    Right,
    map,
    ap,
    chain,
    bimap,
    mapLeft,
    fold,
    of,
    getOrElse,
    getOrElseW,
    alt,
    isLeft,
    isRight,
    fromNullable,
    tryCatch,
    tryCatchK,
    swap,
    filterOrElse,
    traverse,
    sequence,
};
export default Either;
