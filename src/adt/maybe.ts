export type Just<A> = { _tag: "Just"; value: A };
export type Nothing = { _tag: "Nothing" };
export type Maybe<A> = Just<A> | Nothing;

export const Just = <A>(value: A): Maybe<A> => ({ _tag: "Just", value });
export const Nothing: Maybe<never> = { _tag: "Nothing" };

export const map = <A, B>(f: (a: A) => B, ma: Maybe<A>): Maybe<B> =>
  ma._tag === "Just" ? Just(f(ma.value)) : Nothing;

export const chain = <A, B>(f: (a: A) => Maybe<B>, ma: Maybe<A>): Maybe<B> =>
  ma._tag === "Just" ? f(ma.value) : Nothing;

export const of = <A>(a: A): Maybe<A> => Just(a);
