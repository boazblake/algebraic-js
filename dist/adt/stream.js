export const Stream = (subscribe) => {
    return {
        subscribe,
        map: function (f) {
            return Stream((o) => subscribe({
                next: (a) => o.next(f(a)),
                complete: () => o.complete?.(),
            }));
        },
    };
};
