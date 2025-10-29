import { Reader, IO } from "../index";
/** Base Reader for each subsystem */
export const askEnv = Reader((env) => env);
export const askDocument = askEnv.map((e) => e.document);
export const askWindow = askEnv.map((e) => e.window);
export const askStorage = askEnv.map((e) => e.localStorage);
export const askFetch = askEnv.map((e) => e.fetch);
/** Element selection and DOM manipulation */
export const select = (selector) => askDocument.map((doc) => doc.querySelector(selector));
const withElement = (selector, f) => askDocument.map((doc) => IO(() => {
    const el = doc.querySelector(selector);
    return f(el);
}));
export const writeHtml = (selector, html) => withElement(selector, (el) => {
    if (el)
        el.innerHTML = html;
    return el;
});
export const appendHtml = (selector, html) => withElement(selector, (el) => {
    if (el)
        el.insertAdjacentHTML("beforeend", html);
    return el;
});
export const writeText = (selector, text) => withElement(selector, (el) => {
    if (el)
        el.textContent = text;
    return el;
});
/** Get an element safely */
export const getElement = (selector) => askDocument.map((doc) => doc.querySelector(selector));
/** Replace innerHTML */
export const writeToElement = (selector, html) => askDocument.map((doc) => IO(() => {
    const el = doc.querySelector(selector);
    if (el)
        el.innerHTML = html;
    return el;
}));
/** Append to an element */
export const appendToElement = (selector, html) => askDocument.map((doc) => IO(() => {
    const el = doc.querySelector(selector);
    if (el)
        el.insertAdjacentHTML("beforeend", html);
    return el;
}));
/** Window operations */
export const alertIO = (msg) => askWindow.map((win) => IO(() => win.alert(msg)));
export const scrollToIO = (x, y) => askWindow.map((win) => IO(() => win.scrollTo(x, y)));
/** LocalStorage operations */
export const storageSet = (key, val) => askStorage.map((s) => IO(() => s.setItem(key, val)));
export const storageGet = (key) => askStorage.map((s) => IO(() => s.getItem(key)));
/** Network fetch as Task-style IO */
export const fetchIO = (url, options) => askFetch.map((fetchFn) => IO(async () => {
    const res = await fetchFn(url, options);
    return res;
}));
/** Runner: Reader<DomEnv, IO<A>> -> A */
export const runDomIO = (rio, env) => rio.run(env).run();
/** Default browser env */
export const browserEnv = () => ({
    document,
    window,
    localStorage,
    fetch,
});
