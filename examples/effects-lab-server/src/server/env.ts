import type { DomEnv } from "effects-vdom";

export const serverDomEnv = (): DomEnv => {
  // dummy implementations, enough for renderToString and any DOM effects
  const fakeEl = {
    innerHTML: "",
    insertAdjacentHTML: () => {},
    querySelector: () => null,
  } as any;

  const fakeDoc = {
    querySelector: () => fakeEl,
    querySelectorAll: () => [],
    createElement: () => fakeEl,
    documentElement: { classList: { toggle: () => {} } },
  } as any;

  const fakeWin = {
    alert: () => {},
    scrollTo: () => {},
    addEventListener: () => {},
    removeEventListener: () => {},
  } as any;

  return {
    document: fakeDoc,
    window: fakeWin,
    localStorage: {
      getItem: () => null,
      setItem: () => {},
      removeItem: () => {},
      clear: () => {},
      key: () => null,
      length: 0,
    },
    fetch: globalThis.fetch.bind(globalThis),
  };
};
