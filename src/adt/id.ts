export type Id<A> = {
  run: () => A;
  map: <B>(f: (a: A) => B) => Id<B>;
  chain: <B>(f: (a: A) => Id<B>) => Id<B>;
};

type IdConstructor = {
  <A>(a: A): Id<A>;
  of: <A>(a: A) => Id<A>;
};

export const Id = (<A>(a: A): Id<A> => ({
  run: () => a,
  map: (f) => Id(f(a)),
  chain: (f) => f(a),
})) as IdConstructor;

Id.of = <A>(a: A): Id<A> => Id(a);
