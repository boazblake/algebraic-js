export const Reader = ((run) => ({
    run,
    map: (f) => Reader((env) => f(run(env))),
    chain: (f) => Reader((env) => f(run(env)).run(env)),
}));
Reader.of = (a) => Reader(() => a);
Reader.ask = () => Reader((env) => env);
