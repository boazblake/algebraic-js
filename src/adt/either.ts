export type Left<L> = { _tag: "Left"; left: L };
export type Right<R> = { _tag: "Right"; right: R };
export type Either<L, R> = Left<L> | Right<R>;

/** Constructors */
export const Left = <L>(l: L): Either<L, never> => ({ _tag: "Left", left: l });
export const Right = <R>(r: R): Either<never, R> => ({
  _tag: "Right",
  right: r,
});

/** Functor map */
export const map = <L, A, B>(f: (a: A) => B, e: Either<L, A>): Either<L, B> =>
  e._tag === "Right" ? Right(f(e.right)) : e;

/** Applicative apply */
export const ap = <L, A, B>(
  ef: Either<L, (a: A) => B>,
  ea: Either<L, A>
): Either<L, B> => {
  if (ef._tag === "Left") return Left(ef.left);
  if (ea._tag === "Left") return Left(ea.left);
  return Right(ef.right(ea.right));
};

/** Monad chain */
export const chain = <L, A, B>(
  f: (a: A) => Either<L, B>,
  e: Either<L, A>
): Either<L, B> => (e._tag === "Right" ? f(e.right) : e);

/** Bifunctor bimap */
export const bimap = <L, A, L2, B>(
  onLeft: (l: L) => L2,
  onRight: (a: A) => B,
  e: Either<L, A>
): Either<L2, B> =>
  e._tag === "Left" ? Left(onLeft(e.left)) : Right(onRight(e.right));

/** Map over Left */
export const mapLeft = <L, A, L2>(
  f: (l: L) => L2,
  e: Either<L, A>
): Either<L2, A> => (e._tag === "Left" ? Left(f(e.left)) : e);

/** Fold (pattern match) */
export const fold = <L, A, B>(
  onLeft: (l: L) => B,
  onRight: (a: A) => B,
  e: Either<L, A>
): B => (e._tag === "Left" ? onLeft(e.left) : onRight(e.right));

/** Applicative */
export const of = <A>(a: A): Either<never, A> => Right(a);

/** Get Right or default */
export const getOrElse = <L, A>(defaultValue: A, e: Either<L, A>): A =>
  e._tag === "Right" ? e.right : defaultValue;

/** Get Right or compute default */
export const getOrElseW = <L, A, B>(
  onLeft: (l: L) => B,
  e: Either<L, A>
): A | B => (e._tag === "Right" ? e.right : onLeft(e.left));

/** Alternative - returns first Right */
export const alt = <L, A>(e1: Either<L, A>, e2: Either<L, A>): Either<L, A> =>
  e1._tag === "Right" ? e1 : e2;

/** Check if Either is Left */
export const isLeft = <L, A>(e: Either<L, A>): e is Left<L> =>
  e._tag === "Left";

/** Check if Either is Right */
export const isRight = <L, A>(e: Either<L, A>): e is Right<A> =>
  e._tag === "Right";

/** Convert nullable to Either */
export const fromNullable =
  <L>(onNull: L) =>
  <A>(a: A | null | undefined): Either<L, A> =>
    a == null ? Left(onNull) : Right(a);

/** Try-catch wrapper */
export const tryCatch = <A>(f: () => A): Either<unknown, A> => {
  try {
    return Right(f());
  } catch (e) {
    return Left(e);
  }
};

/** Try-catch with error mapper */
export const tryCatchK = <E, A>(
  f: () => A,
  onError: (e: unknown) => E
): Either<E, A> => {
  try {
    return Right(f());
  } catch (e) {
    return Left(onError(e));
  }
};

/** Swap Left and Right */
export const swap = <L, A>(e: Either<L, A>): Either<A, L> =>
  e._tag === "Left" ? Right(e.left) : Left(e.right);

/** Filter Right - converts to Left if predicate fails */
export const filterOrElse = <L, A>(
  predicate: (a: A) => boolean,
  onFalse: (a: A) => L,
  e: Either<L, A>
): Either<L, A> =>
  e._tag === "Right" && !predicate(e.right) ? Left(onFalse(e.right)) : e;

/** Traverse an array */
export const traverse = <L, A, B>(
  f: (a: A) => Either<L, B>,
  arr: A[]
): Either<L, B[]> => {
  const result: B[] = [];
  for (const a of arr) {
    const eb = f(a);
    if (eb._tag === "Left") return eb;
    result.push(eb.right);
  }
  return Right(result);
};

/** Sequence an array of Eithers */
export const sequence = <L, A>(arr: Either<L, A>[]): Either<L, A[]> =>
  traverse((x) => x, arr);

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
