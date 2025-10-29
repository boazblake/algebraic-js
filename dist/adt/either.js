export const Left = (l) => ({ _tag: "Left", left: l });
export const Right = (r) => ({ _tag: "Right", right: r });
export const map = (f, e) => e._tag === "Right" ? Right(f(e.right)) : e;
export const chain = (f, e) => e._tag === "Right" ? f(e.right) : e;
export const fold = (onL, onR, e) => (e._tag === "Left" ? onL(e.left) : onR(e.right));
export const of = (a) => Right(a);
