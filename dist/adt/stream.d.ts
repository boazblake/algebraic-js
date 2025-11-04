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
export declare const Stream: {
    <A>(subscribe: (o: Observer<A>) => Unsubscribe): Stream<A>;
    of<A>(a: A): Stream<A>;
    fromArray<A>(arr: A[]): Stream<A>;
    empty<A>(): Stream<A>;
    never<A>(): Stream<A>;
    fromPromise<A>(p: Promise<A>): Stream<A>;
    interval(ms: number): Stream<number>;
    periodic(ms: number): Stream<void>;
    fromEvent<E extends Event>(target: EventTarget, eventName: string): Stream<E>;
    merge<A>(s1: Stream<A>, s2: Stream<A>): Stream<A>;
    concat<A>(s1: Stream<A>, s2: Stream<A>): Stream<A>;
    combineLatest<A, B>(sa: Stream<A>, sb: Stream<B>): Stream<[A, B]>;
    zip<A, B>(sa: Stream<A>, sb: Stream<B>): Stream<[A, B]>;
    debounce<A>(ms: number): (s: Stream<A>) => Stream<A>;
    throttle<A>(ms: number): (s: Stream<A>) => Stream<A>;
    distinctUntilChanged<A>(equals?: (a: A, b: A) => boolean): (s: Stream<A>) => Stream<A>;
};
export default Stream;
