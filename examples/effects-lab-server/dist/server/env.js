export const serverDomEnv = () => {
    // dummy implementations, enough for renderToString and any DOM effects
    const fakeEl = {
        innerHTML: "",
        insertAdjacentHTML: () => { },
        querySelector: () => null,
    };
    const fakeDoc = {
        querySelector: () => fakeEl,
        querySelectorAll: () => [],
        createElement: () => fakeEl,
        documentElement: { classList: { toggle: () => { } } },
    };
    const fakeWin = {
        alert: () => { },
        scrollTo: () => { },
        addEventListener: () => { },
        removeEventListener: () => { },
    };
    return {
        document: fakeDoc,
        window: fakeWin,
        localStorage: {
            getItem: () => null,
            setItem: () => { },
            removeItem: () => { },
            clear: () => { },
            key: () => null,
            length: 0,
        },
        fetch: globalThis.fetch.bind(globalThis),
    };
};
