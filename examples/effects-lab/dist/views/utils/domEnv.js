import { Reader, IO } from "effects-vdom";
// Reader for accessing environment (like `window.document`)
export const askDom = Reader((env) => env.document);
// Safe IO helper for reading elements
export const getElement = (selector) => askDom.map((doc) => doc.querySelector(selector));
// Safe IO helper for writing text or HTML to a node
export const writeToElement = (selector, html) => IO(() => {
    const el = document.querySelector(selector);
    if (el)
        el.innerHTML = html;
    return el;
});
// IO helper for appending a log entry
export const appendToElement = (selector, html) => IO(() => {
    const el = document.querySelector(selector);
    if (el)
        el.insertAdjacentHTML("beforeend", html);
    return el;
});
// Run a Reader+IO composition
export const runDomIO = (readerIO) => readerIO.run({ document }).run();
