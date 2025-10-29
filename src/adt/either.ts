export type Left<L> = { _tag: "Left"; left: L };
export type Right<R> = { _tag: "Right"; right: R };
export type Either<L, R> = Left<L> | Right<R>;

export const Left = <L>(l: L): Either<L, never> => ({ _tag: "Left", left: l });
export const Right = <R>(r: R): Either<never, R> => ({ _tag: "Right", right: r });

export const map = <L, A, B>(f: (a: A) => B, e: Either<L, A>): Either<L, B> =>
  e._tag === "Right" ? Right(f(e.right)) : e;

export const chain = <L, A, B>(f: (a: A) => Either<L, B>, e: Either<L, A>): Either<L, B> =>
  e._tag === "Right" ? f(e.right) : e;

export const fold = <L, A, B>(
  onL: (l: L) => B,
  onR: (a: A) => B,
  e: Either<L, A>
): B => (e._tag === "Left" ? onL(e.left) : onR(e.right));

export const of = <A>(a: A): Either<never, A> => Right(a);
