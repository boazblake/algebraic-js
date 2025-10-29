export const Reader = (run) => ({
    run,
    map: f => Reader((r) => f(run(r))),
    chain: f => Reader((r) => f(run(r)).run(r))
});
Reader.ask = () => Reader((r) => r);
Reader.of = (a) => Reader(() => a);
