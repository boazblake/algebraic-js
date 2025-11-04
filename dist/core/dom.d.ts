import { Reader } from "../adt/reader.js";
import { IO } from "../adt/io.js";
export type DomEnv = {
    document: Document;
    window: Window;
    localStorage: Storage;
    fetch: typeof fetch;
};
export declare const askEnv: Reader<DomEnv, DomEnv>;
export declare const askDocument: Reader<DomEnv, Document>;
export declare const askWindow: Reader<DomEnv, Window>;
export declare const askStorage: Reader<DomEnv, Storage>;
export declare const askFetch: Reader<DomEnv, typeof fetch>;
export declare const select: (selector: string) => Reader<DomEnv, HTMLElement | null>;
export declare const writeHtml: (selector: string, html: string) => Reader<DomEnv, IO<HTMLElement | null>>;
export declare const appendHtml: (selector: string, html: string) => Reader<DomEnv, IO<HTMLElement | null>>;
export declare const writeText: (selector: string, text: string) => Reader<DomEnv, IO<HTMLElement | null>>;
export declare const getElement: (selector: string) => Reader<DomEnv, HTMLElement | null>;
export declare const writeToElement: (selector: string, html: string) => Reader<DomEnv, IO<HTMLElement | null>>;
export declare const appendToElement: (selector: string, html: string) => Reader<DomEnv, IO<HTMLElement | null>>;
export declare const alertIO: (msg: string) => Reader<DomEnv, IO<void>>;
export declare const scrollToIO: (x: number, y: number) => Reader<DomEnv, IO<void>>;
export declare const storageSet: (key: string, val: string) => Reader<DomEnv, IO<void>>;
export declare const storageGet: (key: string) => Reader<DomEnv, IO<string | null>>;
export declare const fetchIO: (url: string, options?: RequestInit) => Reader<DomEnv, IO<Promise<Response>>>;
export declare const runDomIO: <A>(rio: {
    run: (env: DomEnv) => {
        run: () => A;
    };
}, env: DomEnv) => A;
export declare const browserEnv: () => DomEnv;
