export const Writer = (run) => ({
    run,
    map: f => Writer(() => { const [a, w] = run(); return [f(a), w]; }),
    chain: f => Writer(() => { const [a, w1] = run(); const [b, w2] = f(a).run(); return [b, (Array.isArray(w1) ? w1.concat(w2) : w2)]; })
});
Writer.of = (a, empty) => Writer(() => [a, empty]);
Writer.tell = (w) => Writer(() => [undefined, w]);
