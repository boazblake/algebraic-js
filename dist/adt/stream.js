export const Stream = (subscribe) => ({
    subscribe,
    map: (f) => Stream((o) => subscribe({
        next: (a) => {
            try {
                o.next(f(a));
            }
            catch (e) {
                o.error?.(e);
            }
        },
        error: o.error,
        complete: o.complete,
    })),
    chain: (f) => Stream((o) => {
        let innerUnsub = null;
        const outerUnsub = subscribe({
            next: (a) => {
                try {
                    const inner = f(a);
                    innerUnsub?.();
                    innerUnsub = inner.subscribe(o);
                }
                catch (e) {
                    o.error?.(e);
                }
            },
            error: o.error,
            complete: o.complete,
        });
        return () => {
            innerUnsub?.();
            outerUnsub();
        };
    }),
    filter: (predicate) => Stream((o) => subscribe({
        next: (a) => {
            try {
                if (predicate(a))
                    o.next(a);
            }
            catch (e) {
                o.error?.(e);
            }
        },
        error: o.error,
        complete: o.complete,
    })),
    scan: (f, initial) => Stream((o) => {
        let acc = initial;
        return subscribe({
            next: (a) => {
                try {
                    acc = f(acc, a);
                    o.next(acc);
                }
                catch (e) {
                    o.error?.(e);
                }
            },
            error: o.error,
            complete: o.complete,
        });
    }),
    take: (n) => Stream((o) => {
        let count = 0;
        const unsub = subscribe({
            next: (a) => {
                if (count < n) {
                    o.next(a);
                    count++;
                    if (count === n) {
                        o.complete?.();
                        unsub();
                    }
                }
            },
            error: o.error,
            complete: o.complete,
        });
        return unsub;
    }),
    skip: (n) => Stream((o) => {
        let count = 0;
        return subscribe({
            next: (a) => {
                count++;
                if (count > n)
                    o.next(a);
            },
            error: o.error,
            complete: o.complete,
        });
    }),
});
/** Static constructors */
Stream.of = (a) => Stream((o) => {
    o.next(a);
    o.complete?.();
    return () => { };
});
Stream.fromArray = (arr) => Stream((o) => {
    arr.forEach((a) => o.next(a));
    o.complete?.();
    return () => { };
});
Stream.empty = () => Stream((o) => {
    o.complete?.();
    return () => { };
});
Stream.never = () => Stream(() => () => { });
Stream.fromPromise = (p) => Stream((o) => {
    let cancelled = false;
    p.then((a) => {
        if (!cancelled) {
            o.next(a);
            o.complete?.();
        }
    }).catch((e) => {
        if (!cancelled)
            o.error?.(e);
    });
    return () => {
        cancelled = true;
    };
});
Stream.interval = (ms) => Stream((o) => {
    let count = 0;
    const id = setInterval(() => o.next(count++), ms);
    return () => clearInterval(id);
});
Stream.periodic = (ms) => Stream((o) => {
    const id = setInterval(() => o.next(undefined), ms);
    return () => clearInterval(id);
});
Stream.fromEvent = (target, eventName) => Stream((o) => {
    const handler = (e) => o.next(e);
    target.addEventListener(eventName, handler);
    return () => target.removeEventListener(eventName, handler);
});
/** Combinators */
Stream.merge = (s1, s2) => Stream((o) => {
    const unsub1 = s1.subscribe(o);
    const unsub2 = s2.subscribe(o);
    return () => {
        unsub1();
        unsub2();
    };
});
Stream.concat = (s1, s2) => Stream((o) => {
    let unsub2 = null;
    const unsub1 = s1.subscribe({
        next: o.next,
        error: o.error,
        complete: () => {
            unsub2 = s2.subscribe(o);
        },
    });
    return () => {
        unsub1();
        unsub2?.();
    };
});
Stream.combineLatest = (sa, sb) => Stream((o) => {
    let latestA;
    let latestB;
    let hasA = false;
    let hasB = false;
    const emit = () => {
        if (hasA && hasB) {
            o.next([latestA, latestB]);
        }
    };
    const unsubA = sa.subscribe({
        next: (a) => {
            latestA = a;
            hasA = true;
            emit();
        },
        error: o.error,
    });
    const unsubB = sb.subscribe({
        next: (b) => {
            latestB = b;
            hasB = true;
            emit();
        },
        error: o.error,
    });
    return () => {
        unsubA();
        unsubB();
    };
});
Stream.zip = (sa, sb) => Stream((o) => {
    const queueA = [];
    const queueB = [];
    const tryEmit = () => {
        if (queueA.length > 0 && queueB.length > 0) {
            o.next([queueA.shift(), queueB.shift()]);
        }
    };
    const unsubA = sa.subscribe({
        next: (a) => {
            queueA.push(a);
            tryEmit();
        },
        error: o.error,
        complete: o.complete,
    });
    const unsubB = sb.subscribe({
        next: (b) => {
            queueB.push(b);
            tryEmit();
        },
        error: o.error,
        complete: o.complete,
    });
    return () => {
        unsubA();
        unsubB();
    };
});
/** Utilities */
Stream.debounce =
    (ms) => (s) => Stream((o) => {
        let timeoutId = null;
        const unsub = s.subscribe({
            next: (a) => {
                if (timeoutId)
                    clearTimeout(timeoutId);
                timeoutId = setTimeout(() => o.next(a), ms);
            },
            error: o.error,
            complete: o.complete,
        });
        return () => {
            if (timeoutId)
                clearTimeout(timeoutId);
            unsub();
        };
    });
Stream.throttle =
    (ms) => (s) => Stream((o) => {
        let lastEmit = 0;
        return s.subscribe({
            next: (a) => {
                const now = Date.now();
                if (now - lastEmit >= ms) {
                    o.next(a);
                    lastEmit = now;
                }
            },
            error: o.error,
            complete: o.complete,
        });
    });
Stream.distinctUntilChanged =
    (equals) => (s) => Stream((o) => {
        let last;
        let hasLast = false;
        const eq = equals || ((a, b) => a === b);
        return s.subscribe({
            next: (a) => {
                if (!hasLast || !eq(last, a)) {
                    o.next(a);
                    last = a;
                    hasLast = true;
                }
            },
            error: o.error,
            complete: o.complete,
        });
    });
export default Stream;
