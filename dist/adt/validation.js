export const Failure = (errors) => ({
    _tag: "Failure",
    errors,
});
export const Success = (value) => ({
    _tag: "Success",
    value,
});
/** Functor map */
export const map = (f, v) => (v._tag === "Success" ? Success(f(v.value)) : v);
/** Applicative apply - accumulates errors */
export const ap = (vf, va) => {
    if (vf._tag === "Failure" && va._tag === "Failure")
        return Failure([...vf.errors, ...va.errors]);
    if (vf._tag === "Failure")
        return vf;
    if (va._tag === "Failure")
        return va;
    return Success(vf.value(va.value));
};
/** Monad chain - short-circuits on first error */
export const chain = (f, v) => (v._tag === "Success" ? f(v.value) : v);
/** Bifunctor bimap */
export const bimap = (onFailure, onSuccess, v) => v._tag === "Failure"
    ? Failure(onFailure(v.errors))
    : Success(onSuccess(v.value));
/** Map over errors */
export const mapErrors = (f, v) => (v._tag === "Failure" ? Failure(f(v.errors)) : v);
/** Lift value */
export const of = (a) => Success(a);
/** Fold */
export const fold = (onFail, onSucc, v) => (v._tag === "Failure" ? onFail(v.errors) : onSucc(v.value));
/** Get value or default */
export const getOrElse = (defaultValue, v) => v._tag === "Success" ? v.value : defaultValue;
/** Get value or compute default */
export const getOrElseW = (onFailure, v) => (v._tag === "Success" ? v.value : onFailure(v.errors));
/** Check if Validation is Failure */
export const isFailure = (v) => v._tag === "Failure";
/** Check if Validation is Success */
export const isSuccess = (v) => v._tag === "Success";
/** Create Failure from single error */
export const fail = (error) => Failure([error]);
/** Alternative - returns first Success, accumulates all Failures */
export const alt = (v1, v2) => {
    if (v1._tag === "Success")
        return v1;
    if (v2._tag === "Success")
        return v2;
    return Failure([...v1.errors, ...v2.errors]);
};
/** Combine multiple validations (parallel validation) */
export const combine = (validations) => {
    const successes = [];
    const errors = [];
    for (const v of validations) {
        if (v._tag === "Success") {
            successes.push(v.value);
        }
        else {
            errors.push(...v.errors);
        }
    }
    return errors.length > 0 ? Failure(errors) : Success(successes);
};
/** Traverse an array - accumulates all errors */
export const traverse = (f, arr) => {
    const results = [];
    const errors = [];
    for (const a of arr) {
        const vb = f(a);
        if (vb._tag === "Success") {
            results.push(vb.value);
        }
        else {
            errors.push(...vb.errors);
        }
    }
    return errors.length > 0 ? Failure(errors) : Success(results);
};
/** Sequence an array of Validations */
export const sequence = (arr) => traverse((x) => x, arr);
/** Validate with predicate */
export const fromPredicate = (predicate, onFalse) => (a) => predicate(a) ? Success(a) : fail(onFalse(a));
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
