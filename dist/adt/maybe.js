export const Just = (value) => ({ _tag: "Just", value });
export const Nothing = { _tag: "Nothing" };
export const map = (f, ma) => ma._tag === "Just" ? Just(f(ma.value)) : Nothing;
export const chain = (f, ma) => ma._tag === "Just" ? f(ma.value) : Nothing;
export const of = (a) => Just(a);
