import { h, Reader, Writer, IO, Task, Right } from "effects-vdom";
export const CompositionEffect = (_, __) => {
    const env = { api: "https://api.example.com" };
    const reader = Reader((e) => `Read env: ${e.api}`);
    const writer = Writer.of("Writer init", ["Initialized"]);
    const io = IO(() => `IO side-effect: ${new Date().toISOString()}`);
    const task = Task(() => Promise.resolve(Right("Task complete")));
    const composed = IO(() => {
        const readVal = reader.run(env);
        const [val, logs] = writer.run();
        return `${readVal}\n${val}\nLogs: ${logs.join(", ")}\n${io.run()}`;
    });
    const runComposition = async () => {
        const ioVal = composed.run();
        const taskVal = await task.run();
        alert(`${ioVal}\n${taskVal}`);
    };
    return h("div", { className: "w3-container" }, [
        h("h3", {}, "Composition (Reader → Writer → IO → Task)"),
        h("p", {}, "Composes multiple effects to demonstrate interoperability."),
        h("button", { className: "w3-button w3-theme", onclick: runComposition }, "Run Composition"),
    ]);
};
