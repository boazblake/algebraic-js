import { h, Reader, IO } from "effects-vdom";
export const ReaderEffect = (_, __) => {
    const readEnv = Reader((env) => IO(() => `Reading from ${env.baseUrl}/api`));
    return h("div", { className: "w3-container" }, [
        h("h3", {}, "Reader (Dependency Injection)"),
        h("p", {}, "Passes shared environment through pure functions."),
        h("button", {
            className: "w3-button w3-theme",
            onclick: () => alert(readEnv.run({ baseUrl: "https://example.com" }).run()),
        }, "Run Reader→IO"),
    ]);
};
