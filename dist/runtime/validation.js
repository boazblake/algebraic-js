export const valid = (a) => ({ _tag: 'Valid', value: a });
export const invalid = (...errs) => ({ _tag: 'Invalid', errors: errs });
export const map = (f, v) => v._tag === 'Valid' ? valid(f(v.value)) : v;
export const ap = (vf, va) => {
    if (vf._tag === 'Valid' && va._tag === 'Valid')
        return valid(vf.value(va.value));
    const errs = [];
    if (vf._tag === 'Invalid')
        errs.push(...vf.errors);
    if (va._tag === 'Invalid')
        errs.push(...va.errors);
    return invalid(...errs);
};
