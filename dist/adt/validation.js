export const Failure = (errors) => ({ _tag: "Failure", errors });
export const Success = (value) => ({ _tag: "Success", value });
export const map = (f, v) => v._tag === "Success" ? Success(f(v.value)) : v;
export const ap = (vf, va) => {
    if (vf._tag === "Failure" && va._tag === "Failure")
        return Failure([...vf.errors, ...va.errors]);
    if (vf._tag === "Failure")
        return vf;
    if (va._tag === "Failure")
        return va;
    return Success(vf.value(va.value));
};
export const of = (a) => Success(a);
