export type Observer<A> = {
  next: (a: A) => void;
  error?: (e: unknown) => void;
  complete?: () => void;
};

export type Unsubscribe = () => void;

export type Stream<A> = {
  subscribe: (o: Observer<A>) => Unsubscribe;
  map: <B>(f: (a: A) => B) => Stream<B>;
  chain: <B>(f: (a: A) => Stream<B>) => Stream<B>;
  filter: (predicate: (a: A) => boolean) => Stream<A>;
  scan: <B>(f: (acc: B, a: A) => B, initial: B) => Stream<B>;
  take: (n: number) => Stream<A>;
  skip: (n: number) => Stream<A>;
};

export const Stream = <A>(
  subscribe: (o: Observer<A>) => Unsubscribe
): Stream<A> => ({
  subscribe,

  map: <B>(f: (a: A) => B): Stream<B> =>
    Stream((o) =>
      subscribe({
        next: (a) => {
          try {
            o.next(f(a));
          } catch (e) {
            o.error?.(e);
          }
        },
        error: o.error,
        complete: o.complete,
      })
    ),

  chain: <B>(f: (a: A) => Stream<B>): Stream<B> =>
    Stream((o) => {
      let innerUnsub: Unsubscribe | null = null;

      const outerUnsub = subscribe({
        next: (a) => {
          try {
            const inner = f(a);
            innerUnsub?.();
            innerUnsub = inner.subscribe(o);
          } catch (e) {
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

  filter: (predicate: (a: A) => boolean): Stream<A> =>
    Stream((o) =>
      subscribe({
        next: (a) => {
          try {
            if (predicate(a)) o.next(a);
          } catch (e) {
            o.error?.(e);
          }
        },
        error: o.error,
        complete: o.complete,
      })
    ),

  scan: <B>(f: (acc: B, a: A) => B, initial: B): Stream<B> =>
    Stream((o) => {
      let acc = initial;
      return subscribe({
        next: (a) => {
          try {
            acc = f(acc, a);
            o.next(acc);
          } catch (e) {
            o.error?.(e);
          }
        },
        error: o.error,
        complete: o.complete,
      });
    }),

  take: (n: number): Stream<A> =>
    Stream((o) => {
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

  skip: (n: number): Stream<A> =>
    Stream((o) => {
      let count = 0;
      return subscribe({
        next: (a) => {
          count++;
          if (count > n) o.next(a);
        },
        error: o.error,
        complete: o.complete,
      });
    }),
});

/** Static constructors */
Stream.of = <A>(a: A): Stream<A> =>
  Stream((o) => {
    o.next(a);
    o.complete?.();
    return () => {};
  });

Stream.fromArray = <A>(arr: A[]): Stream<A> =>
  Stream((o) => {
    arr.forEach((a) => o.next(a));
    o.complete?.();
    return () => {};
  });

Stream.empty = <A>(): Stream<A> =>
  Stream((o) => {
    o.complete?.();
    return () => {};
  });

Stream.never = <A>(): Stream<A> => Stream(() => () => {});

Stream.fromPromise = <A>(p: Promise<A>): Stream<A> =>
  Stream((o) => {
    let cancelled = false;
    p.then((a) => {
      if (!cancelled) {
        o.next(a);
        o.complete?.();
      }
    }).catch((e) => {
      if (!cancelled) o.error?.(e);
    });
    return () => {
      cancelled = true;
    };
  });

Stream.interval = (ms: number): Stream<number> =>
  Stream((o) => {
    let count = 0;
    const id = setInterval(() => o.next(count++), ms);
    return () => clearInterval(id);
  });

Stream.periodic = (ms: number): Stream<void> =>
  Stream((o) => {
    const id = setInterval(() => o.next(undefined), ms);
    return () => clearInterval(id);
  });

Stream.fromEvent = <E extends Event>(
  target: EventTarget,
  eventName: string
): Stream<E> =>
  Stream((o) => {
    const handler = (e: Event) => o.next(e as E);
    target.addEventListener(eventName, handler);
    return () => target.removeEventListener(eventName, handler);
  });

/** Combinators */
Stream.merge = <A>(s1: Stream<A>, s2: Stream<A>): Stream<A> =>
  Stream((o) => {
    const unsub1 = s1.subscribe(o);
    const unsub2 = s2.subscribe(o);
    return () => {
      unsub1();
      unsub2();
    };
  });

Stream.concat = <A>(s1: Stream<A>, s2: Stream<A>): Stream<A> =>
  Stream((o) => {
    let unsub2: Unsubscribe | null = null;
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

Stream.combineLatest = <A, B>(sa: Stream<A>, sb: Stream<B>): Stream<[A, B]> =>
  Stream((o) => {
    let latestA: A | undefined;
    let latestB: B | undefined;
    let hasA = false;
    let hasB = false;

    const emit = () => {
      if (hasA && hasB) {
        o.next([latestA!, latestB!]);
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

Stream.zip = <A, B>(sa: Stream<A>, sb: Stream<B>): Stream<[A, B]> =>
  Stream((o) => {
    const queueA: A[] = [];
    const queueB: B[] = [];

    const tryEmit = () => {
      if (queueA.length > 0 && queueB.length > 0) {
        o.next([queueA.shift()!, queueB.shift()!]);
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
  <A>(ms: number) =>
  (s: Stream<A>): Stream<A> =>
    Stream((o) => {
      let timeoutId: NodeJS.Timeout | null = null;
      const unsub = s.subscribe({
        next: (a) => {
          if (timeoutId) clearTimeout(timeoutId);
          timeoutId = setTimeout(() => o.next(a), ms);
        },
        error: o.error,
        complete: o.complete,
      });
      return () => {
        if (timeoutId) clearTimeout(timeoutId);
        unsub();
      };
    });

Stream.throttle =
  <A>(ms: number) =>
  (s: Stream<A>): Stream<A> =>
    Stream((o) => {
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
  <A>(equals?: (a: A, b: A) => boolean) =>
  (s: Stream<A>): Stream<A> =>
    Stream((o) => {
      let last: A | undefined;
      let hasLast = false;
      const eq = equals || ((a, b) => a === b);

      return s.subscribe({
        next: (a) => {
          if (!hasLast || !eq(last!, a)) {
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
