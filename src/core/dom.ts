import {  Reader,  IO } from "../index";

/** Full browser environment */
export type DomEnv = {
  document: Document;
  window: Window;
  localStorage: Storage;
  fetch: typeof fetch;
};

/** Base Reader for each subsystem */
export const askEnv = Reader<DomEnv, DomEnv>((env) => env);
export const askDocument = askEnv.map((e) => e.document);
export const askWindow = askEnv.map((e) => e.window);
export const askStorage = askEnv.map((e) => e.localStorage);
export const askFetch = askEnv.map((e) => e.fetch);

/** Element selection and DOM manipulation */
export const select = (selector: string) =>
  askDocument.map((doc) => doc.querySelector<HTMLElement>(selector));

const withElement =
  <A>(selector: string, f: (el: HTMLElement | null) => A) =>
    askDocument.map((doc) =>
      IO(() => {
        const el = doc.querySelector<HTMLElement>(selector);
        return f(el);
      })
    );

export const writeHtml = (selector: string, html: string) =>
  withElement(selector, (el) => {
    if (el) el.innerHTML = html;
    return el;
  });

export const appendHtml = (selector: string, html: string) =>
  withElement(selector, (el) => {
    if (el) el.insertAdjacentHTML("beforeend", html);
    return el;
  });

export const writeText = (selector: string, text: string) =>
  withElement(selector, (el) => {
    if (el) el.textContent = text;
    return el;
  });

/** Get an element safely */
export const getElement = (selector: string) =>
  askDocument.map((doc) => doc.querySelector<HTMLElement>(selector));

/** Replace innerHTML */
export const writeToElement = (selector: string, html: string) =>
  askDocument.map((doc) =>
    IO(() => {
      const el = doc.querySelector<HTMLElement>(selector);
      if (el) el.innerHTML = html;
      return el;
    })
  );

/** Append to an element */
export const appendToElement = (selector: string, html: string) =>
  askDocument.map((doc) =>
    IO(() => {
      const el = doc.querySelector<HTMLElement>(selector);
      if (el) el.insertAdjacentHTML("beforeend", html);
      return el;
    })
  );

/** Window operations */
export const alertIO = (msg: string) =>
  askWindow.map((win) => IO(() => win.alert(msg)));

export const scrollToIO = (x: number, y: number) =>
  askWindow.map((win) => IO(() => win.scrollTo(x, y)));

/** LocalStorage operations */
export const storageSet = (key: string, val: string) =>
  askStorage.map((s) => IO(() => s.setItem(key, val)));

export const storageGet = (key: string) =>
  askStorage.map((s) => IO(() => s.getItem(key)));

/** Network fetch as Task-style IO */
export const fetchIO = (url: string, options?: RequestInit) =>
  askFetch.map((fetchFn) =>
    IO(async () => {
      const res = await fetchFn(url, options);
      return res;
    })
  );

/** Runner: Reader<DomEnv, IO<A>> -> A */
export const runDomIO = <A>(
  rio: { run: (env: DomEnv) => { run: () => A } },
  env: DomEnv
): A => rio.run(env).run();

/** Default browser env */
export const browserEnv = (): DomEnv => ({
  document,
  window,
  localStorage,
  fetch,
});
