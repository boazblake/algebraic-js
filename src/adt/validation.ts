export type Validation<E, A> =
  | { _tag: "Failure"; errors: E[] }
  | { _tag: "Success"; value: A };

export const Failure = <E>(errors: E[]): Validation<E, never> => ({ _tag: "Failure", errors });
export const Success = <A>(value: A): Validation<never, A> => ({ _tag: "Success", value });

export const map = <E, A, B>(f: (a: A) => B, v: Validation<E, A>): Validation<E, B> =>
  v._tag === "Success" ? Success(f(v.value)) : v;

export const ap = <E, A, B>(
  vf: Validation<E, (a: A) => B>,
  va: Validation<E, A>
): Validation<E, B> => {
  if (vf._tag === "Failure" && va._tag === "Failure")
    return Failure([...vf.errors, ...va.errors]);
  if (vf._tag === "Failure") return vf;
  if (va._tag === "Failure") return va;
  return Success(vf.value(va.value));
};

export const of = <A>(a: A): Validation<never, A> => Success(a);
