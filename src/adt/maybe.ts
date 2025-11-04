export type Just<A> = { _tag: "Just"; value: A };
export type Nothing = { _tag: "Nothing" };
export type Maybe<A> = Just<A> | Nothing;

/** Constructors */
export const Just = <A>(value: A): Maybe<A> => ({ _tag: "Just", value });
export const Nothing: Maybe<never> = { _tag: "Nothing" };

/** Functor map */
export const map = <A, B>(
  f: (a: A) => B,
  ma: Maybe<A>
): Maybe<B> => (ma._tag === "Just" ? Just(f(ma.value)) : Nothing);

/** Applicative apply */
export const ap = <A, B>(
  mf: Maybe<(a: A) => B>,
  ma: Maybe<A>
): Maybe<B> =>
  mf._tag === "Just" && ma._tag === "Just"
    ? Just(mf.value(ma.value))
    : Nothing;

/** Monad chain */
export const chain = <A, B>(
  f: (a: A) => Maybe<B>,
  ma: Maybe<A>
): Maybe<B> => (ma._tag === "Just" ? f(ma.value) : Nothing);

/** Applicative pure */
export const of = <A>(a: A): Maybe<A> => Just(a);

/** Pattern matching (fold) */
export const fold = <A, B>(
  onNothing: () => B,
  onJust: (a: A) => B,
  ma: Maybe<A>
): B => (ma._tag === "Nothing" ? onNothing() : onJust(ma.value));

/** Get value or default */
export const getOrElse = <A>(
  defaultValue: A,
  ma: Maybe<A>
): A => (ma._tag === "Just" ? ma.value : defaultValue);

/** Get value or compute default */
export const getOrElseW = <A, B>(
  onNothing: () => B,
  ma: Maybe<A>
): A | B => (ma._tag === "Just" ? ma.value : onNothing());

/** Alternative - returns first Just */
export const alt = <A>(
  ma1: Maybe<A>,
  ma2: Maybe<A>
): Maybe<A> => (ma1._tag === "Just" ? ma1 : ma2);

/** Convert nullable to Maybe */
export const fromNullable = <A>(a: A | null | undefined): Maybe<A> =>
  a == null ? Nothing : Just(a);

/** Convert Maybe to nullable */
export const toNullable = <A>(ma: Maybe<A>): A | null =>
  ma._tag === "Just" ? ma.value : null;

/** Convert Maybe to undefined */
export const toUndefined = <A>(ma: Maybe<A>): A | undefined =>
  ma._tag === "Just" ? ma.value : undefined;

/** Check if Maybe is Just */
export const isJust = <A>(ma: Maybe<A>): ma is Just<A> => ma._tag === "Just";

/** Check if Maybe is Nothing */
export const isNothing = <A>(ma: Maybe<A>): ma is Nothing => ma._tag === "Nothing";

/** Filter - keep Just only if predicate passes */
export const filter = <A>(
  predicate: (a: A) => boolean,
  ma: Maybe<A>
): Maybe<A> =>
  ma._tag === "Just" && predicate(ma.value) ? ma : Nothing;

/** Traverse an array */
export const traverse = <A, B>(
  f: (a: A) => Maybe<B>,
  arr: A[]
): Maybe<B[]> => {
  const result: B[] = [];
  for (const a of arr) {
    const mb = f(a);
    if (mb._tag === "Nothing") return Nothing;
    result.push(mb.value);
  }
  return Just(result);
};

/** Sequence an array of Maybes */
export const sequence = <A>(arr: Maybe<A>[]): Maybe<A[]> =>
  traverse((x) => x, arr);

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
