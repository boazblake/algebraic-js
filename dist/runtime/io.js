export const IO = (run) => ({
    run,
    map: (f) => IO(() => f(run())),
    chain: (f) => IO(() => f(run()).run()),
});
IO.of = (a) => IO(() => a);
