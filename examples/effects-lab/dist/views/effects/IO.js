import { h, IO } from "effects-vdom";
export const IOEffect = (_, __) => {
    const io1 = IO(() => new Date().toISOString());
    const io2 = io1.map((s) => `Mapped: ${s}`).chain((s) => IO(() => `${s} [Finalized]`));
    return h("div", { className: "w3-container" }, [
        h("h3", {}, "IO (Impure Effect)"),
        h("p", {}, "Encapsulates side effects like time, DOM, or I/O."),
        h("button", {
            className: "w3-button w3-theme",
            onclick: () => alert(io2.run()),
        }, "Run IO"),
    ]);
};
