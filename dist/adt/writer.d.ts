export type Writer<W, A> = {
    run: () => [A, W];
    map: <B>(f: (a: A) => B) => Writer<W, B>;
    chain: <B>(f: (a: A) => Writer<W, B>) => Writer<W, B>;
    ap: <B>(fb: Writer<W, (a: A) => B>) => Writer<W, B>;
};
/** Writer constructor */
export declare const Writer: {
    <W, A>(run: () => [A, W]): Writer<W, A>;
    of<W, A>(a: A, empty: W): Writer<W, A>;
    tell<W>(w: W): Writer<W, void>;
    map<W, A, B>(f: (a: A) => B): (w: Writer<W, A>) => Writer<W, B>;
    chain<W, A, B>(f: (a: A) => Writer<W, B>): (w: Writer<W, A>) => Writer<W, B>;
    ap<W, A, B>(fb: Writer<W, (a: A) => B>): (fa: Writer<W, A>) => Writer<W, B>;
    run<W, A>(w: Writer<W, A>): [A, W];
    evalWriter<W, A>(w: Writer<W, A>): A;
    execWriter<W, A>(w: Writer<W, A>): W;
    listen<W, A>(w: Writer<W, A>): Writer<W, [A, W]>;
    pass<W, A>(w: Writer<W, [A, (w: W) => W]>): Writer<W, A>;
    censor<W, A>(f: (w: W) => W): (w: Writer<W, A>) => Writer<W, A>;
    updateValueAndLog<A>(w: Writer<string[], A>, message: string): Writer<string[], A>;
    sequence<W, A>(writers: Writer<W, A>[]): Writer<W, A[]>;
    traverse<W, A, B>(f: (a: A) => Writer<W, B>): (arr: A[]) => Writer<W, B[]>;
};
/** Unified object export */
export default Writer;
