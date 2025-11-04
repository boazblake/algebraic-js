export type Validation<E, A> =
  | { _tag: "Failure"; errors: E[] }
  | { _tag: "Success"; value: A };

export const Failure = <E>(errors: E[]): Validation<E, never> => ({
  _tag: "Failure",
  errors,
});

export const Success = <A>(value: A): Validation<never, A> => ({
  _tag: "Success",
  value,
});

/** Functor map */
export const map = <E, A, B>(
  f: (a: A) => B,
  v: Validation<E, A>
): Validation<E, B> => (v._tag === "Success" ? Success(f(v.value)) : v);

/** Applicative apply - accumulates errors */
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

/** Monad chain - short-circuits on first error */
export const chain = <E, A, B>(
  f: (a: A) => Validation<E, B>,
  v: Validation<E, A>
): Validation<E, B> => (v._tag === "Success" ? f(v.value) : v);

/** Bifunctor bimap */
export const bimap = <E, A, E2, B>(
  onFailure: (errs: E[]) => E2[],
  onSuccess: (a: A) => B,
  v: Validation<E, A>
): Validation<E2, B> =>
  v._tag === "Failure"
    ? Failure(onFailure(v.errors))
    : Success(onSuccess(v.value));

/** Map over errors */
export const mapErrors = <E, A, E2>(
  f: (errs: E[]) => E2[],
  v: Validation<E, A>
): Validation<E2, A> => (v._tag === "Failure" ? Failure(f(v.errors)) : v);

/** Lift value */
export const of = <A>(a: A): Validation<never, A> => Success(a);

/** Fold */
export const fold = <E, A, B>(
  onFail: (errs: E[]) => B,
  onSucc: (a: A) => B,
  v: Validation<E, A>
): B => (v._tag === "Failure" ? onFail(v.errors) : onSucc(v.value));

/** Get value or default */
export const getOrElse = <E, A>(defaultValue: A, v: Validation<E, A>): A =>
  v._tag === "Success" ? v.value : defaultValue;

/** Get value or compute default */
export const getOrElseW = <E, A, B>(
  onFailure: (errs: E[]) => B,
  v: Validation<E, A>
): A | B => (v._tag === "Success" ? v.value : onFailure(v.errors));

/** Check if Validation is Failure */
export const isFailure = <E, A>(
  v: Validation<E, A>
): v is { _tag: "Failure"; errors: E[] } => v._tag === "Failure";

/** Check if Validation is Success */
export const isSuccess = <E, A>(
  v: Validation<E, A>
): v is { _tag: "Success"; value: A } => v._tag === "Success";

/** Create Failure from single error */
export const fail = <E>(error: E): Validation<E, never> => Failure([error]);

/** Alternative - returns first Success, accumulates all Failures */
export const alt = <E, A>(
  v1: Validation<E, A>,
  v2: Validation<E, A>
): Validation<E, A> => {
  if (v1._tag === "Success") return v1;
  if (v2._tag === "Success") return v2;
  return Failure([...v1.errors, ...v2.errors]);
};

/** Combine multiple validations (parallel validation) */
export const combine = <E, A>(
  validations: Validation<E, A>[]
): Validation<E, A[]> => {
  const successes: A[] = [];
  const errors: E[] = [];

  for (const v of validations) {
    if (v._tag === "Success") {
      successes.push(v.value);
    } else {
      errors.push(...v.errors);
    }
  }

  return errors.length > 0 ? Failure(errors) : Success(successes);
};

/** Traverse an array - accumulates all errors */
export const traverse = <E, A, B>(
  f: (a: A) => Validation<E, B>,
  arr: A[]
): Validation<E, B[]> => {
  const results: B[] = [];
  const errors: E[] = [];

  for (const a of arr) {
    const vb = f(a);
    if (vb._tag === "Success") {
      results.push(vb.value);
    } else {
      errors.push(...vb.errors);
    }
  }

  return errors.length > 0 ? Failure(errors) : Success(results);
};

/** Sequence an array of Validations */
export const sequence = <E, A>(arr: Validation<E, A>[]): Validation<E, A[]> =>
  traverse((x) => x, arr);

/** Validate with predicate */
export const fromPredicate =
  <E, A>(predicate: (a: A) => boolean, onFalse: (a: A) => E) =>
  (a: A): Validation<E, A> =>
    predicate(a) ? Success(a) : fail(onFalse(a));

/** Unified object export */
export const Validation = {
  Failure,
  Success,
  map,
  ap,
  chain,
  bimap,
  mapErrors,
  of,
  fold,
  getOrElse,
  getOrElseW,
  isFailure,
  isSuccess,
  fail,
  alt,
  combine,
  traverse,
  sequence,
  fromPredicate,
};

export default Validation;
