import { Reader } from "../adt/reader.js";
import { IO } from "../adt/io.js";

export type DomEnv = {
  document: Document;
  window: Window;
  localStorage: Storage;
  sessionStorage: Storage;
  fetch: typeof fetch;
};

export type NetEnv = DomEnv & { ws: WebSocket };

export const askEnv = Reader<DomEnv, DomEnv>((env) => env);
export const askDocument = askEnv.map((e) => e.document);
export const askWindow = askEnv.map((e) => e.window);
export const askLocal = askEnv.map((e) => e.localStorage);
export const askSession = askEnv.map((e) => e.sessionStorage);
export const askFetch = askEnv.map((e) => e.fetch);

export const select = (selector: string) =>
  askDocument.map((doc) => doc.querySelector<HTMLElement>(selector));

const withElement = <A>(selector: string, f: (el: HTMLElement | null) => A) =>
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

export const getElement = (selector: string) =>
  askDocument.map((doc) => doc.querySelector<HTMLElement>(selector));

export const writeToElement = (selector: string, html: string) =>
  askDocument.map((doc) =>
    IO(() => {
      const el = doc.querySelector<HTMLElement>(selector);
      if (el) el.innerHTML = html;
      return el;
    })
  );

export const appendToElement = (selector: string, html: string) =>
  askDocument.map((doc) =>
    IO(() => {
      const el = doc.querySelector<HTMLElement>(selector);
      if (el) el.insertAdjacentHTML("beforeend", html);
      return el;
    })
  );

export const alertIO = (msg: string) =>
  askWindow.map((win) => IO(() => win.alert(msg)));
export const scrollToIO = (x: number, y: number) =>
  askWindow.map((win) => IO(() => win.scrollTo(x, y)));

export const localSet = (key: string, val: string) =>
  askLocal.map((s) => IO(() => s.setItem(key, val)));
export const localGet = (key: string) =>
  askLocal.map((s) => IO(() => s.getItem(key)));

export const sessionSet = (key: string, val: string) =>
  askSession.map((s) => IO(() => s.setItem(key, val)));
export const sessionGet = (key: string) =>
  askSession.map((s) => IO(() => s.getItem(key)));

export const fetchIO = (url: string, options?: RequestInit) =>
  askFetch.map((fetchFn) => IO(async () => fetchFn(url, options)));

export const runDomIO = <A>(
  rio: { run: (env: DomEnv) => { run: () => A } },
  env: DomEnv
): A => rio.run(env).run();

export const browserEnv = (): DomEnv => ({
  document,
  window,
  localStorage,
  sessionStorage,
  fetch,
});
