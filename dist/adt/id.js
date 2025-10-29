export const Id = ((a) => ({
    run: () => a,
    map: (f) => Id(f(a)),
    chain: (f) => f(a),
}));
Id.of = (a) => Id(a);
