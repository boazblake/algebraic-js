export const Writer = ((run) => {
    const self = {
        run,
        map: (f) => Writer(() => {
            const [a, w] = run();
            return [f(a), w];
        }),
        chain: (f) => Writer(() => {
            const [a, w1] = run();
            const [b, w2] = f(a).run();
            const concat = Array.isArray(w1)
                ? [...w1, ...w2]
                : w2;
            return [b, concat];
        }),
    };
    return self;
});
Writer.of = (a, empty) => Writer(() => [a, empty]);
Writer.tell = (w) => Writer(() => [undefined, w]);
export const updateValueAndLog = (w, message) => w.chain((a) => Writer(() => [a, [message]]));
