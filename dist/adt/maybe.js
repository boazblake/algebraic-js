/** Constructors */
export const Just = (value) => ({ _tag: "Just", value });
export const Nothing = { _tag: "Nothing" };
/** Functor map */
export const map = (f, ma) => ma._tag === "Just" ? Just(f(ma.value)) : Nothing;
/** Applicative apply */
export const ap = (mf, ma) => mf._tag === "Just" && ma._tag === "Just" ? Just(mf.value(ma.value)) : Nothing;
/** Monad chain */
export const chain = (f, ma) => ma._tag === "Just" ? f(ma.value) : Nothing;
/** Applicative pure */
export const of = (a) => Just(a);
/** Pattern matching (fold) */
export const fold = (onNothing, onJust, ma) => (ma._tag === "Nothing" ? onNothing() : onJust(ma.value));
/** Get value or default */
export const getOrElse = (defaultValue, ma) => ma._tag === "Just" ? ma.value : defaultValue;
/** Get value or compute default */
export const getOrElseW = (onNothing, ma) => ma._tag === "Just" ? ma.value : onNothing();
/** Alternative - returns first Just */
export const alt = (ma1, ma2) => ma1._tag === "Just" ? ma1 : ma2;
/** Convert nullable to Maybe */
export const fromNullable = (a) => a == null ? Nothing : Just(a);
/** Convert Maybe to nullable */
export const toNullable = (ma) => ma._tag === "Just" ? ma.value : null;
/** Convert Maybe to undefined */
export const toUndefined = (ma) => ma._tag === "Just" ? ma.value : undefined;
/** Check if Maybe is Just */
export const isJust = (ma) => ma._tag === "Just";
/** Check if Maybe is Nothing */
export const isNothing = (ma) => ma._tag === "Nothing";
/** Filter - keep Just only if predicate passes */
export const filter = (predicate, ma) => (ma._tag === "Just" && predicate(ma.value) ? ma : Nothing);
/** Traverse an array */
export const traverse = (f, arr) => {
    const result = [];
    for (const a of arr) {
        const mb = f(a);
        if (mb._tag === "Nothing")
            return Nothing;
        result.push(mb.value);
    }
    return Just(result);
};
/** Sequence an array of Maybes */
export const sequence = (arr) => traverse((x) => x, arr);
/** Unified static interface */
export const Maybe = {
    Just,
    Nothing,
    map,
    ap,
    chain,
    of,
    fold,
    getOrElse,
    getOrElseW,
    alt,
    fromNullable,
    toNullable,
    toUndefined,
    isJust,
    isNothing,
    filter,
    traverse,
    sequence,
};
export default Maybe;
