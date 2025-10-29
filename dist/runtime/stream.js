export const Stream = (subscribe) => ({
    subscribe,
    map: (f) => Stream(o => subscribe({
        next: (a) => o.next(f(a)),
        error: o.error,
        complete: o.complete,
    })),
    flatMap: (f) => Stream(o => subscribe({
        next: (a) => f(a).subscribe(o),
        error: o.error,
        complete: o.complete,
    })),
});
export const fromEvent = (el, type) => Stream(obs => { const h = (e) => obs.next(e); el.addEventListener(type, h); return { unsubscribe: () => el.removeEventListener(type, h) }; });
