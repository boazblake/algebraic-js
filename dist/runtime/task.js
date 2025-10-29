export const Task = (run) => {
    let controller = null;
    const wrapped = () => {
        controller = new AbortController();
        return run();
    };
    const cancel = () => controller?.abort();
    return {
        run: wrapped,
        cancel,
        map: f => Task(() => wrapped().then(f)),
        chain: f => Task(() => wrapped().then(a => f(a).run()))
    };
};
Task.of = (a) => Task(() => Promise.resolve(a));
