import { h, Writer, runDomIO, appendToElement, browserEnv } from "effects-vdom";
export const WriterEffect = (m) => {
    let writer = Writer.of("", []);
    const writeLog = () => {
        const msg = `Log entry ${new Date().toLocaleTimeString()}`;
        writer = writer.chain(() => Writer(() => ["", [msg]]));
        runDomIO(appendToElement("#writer-output", `<li>${msg}</li>`), browserEnv());
    };
    return h("section", { className: "w3-padding" }, [
        h("h3", {}, "Writer Monad"),
        h("button", { className: "w3-button w3-theme", onclick: writeLog }, "Append Log"),
        h("ul", { id: "writer-output", className: "w3-ul w3-small" }),
        h('section', {}, JSON.stringify(m))
    ]);
};
