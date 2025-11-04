export type Validation<E, A> = {
    _tag: "Failure";
    errors: E[];
} | {
    _tag: "Success";
    value: A;
};
export declare const Failure: <E>(errors: E[]) => Validation<E, never>;
export declare const Success: <A>(value: A) => Validation<never, A>;
/** Functor map */
export declare const map: <E, A, B>(f: (a: A) => B, v: Validation<E, A>) => Validation<E, B>;
/** Applicative apply - accumulates errors */
export declare const ap: <E, A, B>(vf: Validation<E, (a: A) => B>, va: Validation<E, A>) => Validation<E, B>;
/** Monad chain - short-circuits on first error */
export declare const chain: <E, A, B>(f: (a: A) => Validation<E, B>, v: Validation<E, A>) => Validation<E, B>;
/** Bifunctor bimap */
export declare const bimap: <E, A, E2, B>(onFailure: (errs: E[]) => E2[], onSuccess: (a: A) => B, v: Validation<E, A>) => Validation<E2, B>;
/** Map over errors */
export declare const mapErrors: <E, A, E2>(f: (errs: E[]) => E2[], v: Validation<E, A>) => Validation<E2, A>;
/** Lift value */
export declare const of: <A>(a: A) => Validation<never, A>;
/** Fold */
export declare const fold: <E, A, B>(onFail: (errs: E[]) => B, onSucc: (a: A) => B, v: Validation<E, A>) => B;
/** Get value or default */
export declare const getOrElse: <E, A>(defaultValue: A, v: Validation<E, A>) => A;
/** Get value or compute default */
export declare const getOrElseW: <E, A, B>(onFailure: (errs: E[]) => B, v: Validation<E, A>) => A | B;
/** Check if Validation is Failure */
export declare const isFailure: <E, A>(v: Validation<E, A>) => v is {
    _tag: "Failure";
    errors: E[];
};
/** Check if Validation is Success */
export declare const isSuccess: <E, A>(v: Validation<E, A>) => v is {
    _tag: "Success";
    value: A;
};
/** Create Failure from single error */
export declare const fail: <E>(error: E) => Validation<E, never>;
/** Alternative - returns first Success, accumulates all Failures */
export declare const alt: <E, A>(v1: Validation<E, A>, v2: Validation<E, A>) => Validation<E, A>;
/** Combine multiple validations (parallel validation) */
export declare const combine: <E, A>(validations: Validation<E, A>[]) => Validation<E, A[]>;
/** Traverse an array - accumulates all errors */
export declare const traverse: <E, A, B>(f: (a: A) => Validation<E, B>, arr: A[]) => Validation<E, B[]>;
/** Sequence an array of Validations */
export declare const sequence: <E, A>(arr: Validation<E, A>[]) => Validation<E, A[]>;
/** Validate with predicate */
export declare const fromPredicate: <E, A>(predicate: (a: A) => boolean, onFalse: (a: A) => E) => (a: A) => Validation<E, A>;
/** Unified object export */
export declare const Validation: {
    Failure: <E>(errors: E[]) => Validation<E, never>;
    Success: <A>(value: A) => Validation<never, A>;
    map: <E, A, B>(f: (a: A) => B, v: Validation<E, A>) => Validation<E, B>;
    ap: <E, A, B>(vf: Validation<E, (a: A) => B>, va: Validation<E, A>) => Validation<E, B>;
    chain: <E, A, B>(f: (a: A) => Validation<E, B>, v: Validation<E, A>) => Validation<E, B>;
    bimap: <E, A, E2, B>(onFailure: (errs: E[]) => E2[], onSuccess: (a: A) => B, v: Validation<E, A>) => Validation<E2, B>;
    mapErrors: <E, A, E2>(f: (errs: E[]) => E2[], v: Validation<E, A>) => Validation<E2, A>;
    of: <A>(a: A) => Validation<never, A>;
    fold: <E, A, B>(onFail: (errs: E[]) => B, onSucc: (a: A) => B, v: Validation<E, A>) => B;
    getOrElse: <E, A>(defaultValue: A, v: Validation<E, A>) => A;
    getOrElseW: <E, A, B>(onFailure: (errs: E[]) => B, v: Validation<E, A>) => A | B;
    isFailure: <E, A>(v: Validation<E, A>) => v is {
        _tag: "Failure";
        errors: E[];
    };
    isSuccess: <E, A>(v: Validation<E, A>) => v is {
        _tag: "Success";
        value: A;
    };
    fail: <E>(error: E) => Validation<E, never>;
    alt: <E, A>(v1: Validation<E, A>, v2: Validation<E, A>) => Validation<E, A>;
    combine: <E, A>(validations: Validation<E, A>[]) => Validation<E, A[]>;
    traverse: <E, A, B>(f: (a: A) => Validation<E, B>, arr: A[]) => Validation<E, B[]>;
    sequence: <E, A>(arr: Validation<E, A>[]) => Validation<E, A[]>;
    fromPredicate: <E, A>(predicate: (a: A) => boolean, onFalse: (a: A) => E) => (a: A) => Validation<E, A>;
};
export default Validation;
