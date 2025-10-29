import { h, Id, writeToElement, runDomIO, browserEnv } from "effects-vdom";
import { safeEval } from "../utils/safeEval";
export const IdEffect = () => {
    let input = "5";
    let fnStr = "x => x + 1";
    const compute = (num, fn) => {
        const wrapped = Id.of(num);
        const mapped = wrapped.map(fn);
        const chained = wrapped.chain((x) => Id.of(fn(x)));
        return `
      <ul>
        <li>Input: ${num}</li>
        <li>Mapped: ${mapped.run()}</li>
        <li>Chained: ${chained.run()}</li>
      </ul>`;
    };
    const runAll = () => {
        try {
            const num = Number(input);
            const fn = safeEval(fnStr);
            const html = compute(num, fn);
            runDomIO(writeToElement("#id-output", html), browserEnv());
        }
        catch {
            alert("Invalid function — try `x => x * 2`");
        }
    };
    return h("section", { className: "w3-padding" }, [
        h("h3", {}, "Identity Monad"),
        h("input", {
            className: "w3-input w3-border w3-margin-bottom",
            value: input,
            oninput: (e) => (input = e.target.value),
            "aria-label": "Input value",
        }),
        h("input", {
            className: "w3-input w3-border w3-margin-bottom",
            value: fnStr,
            oninput: (e) => (fnStr = e.target.value),
            "aria-label": "Function expression",
        }),
        h("button", { className: "w3-button w3-theme", onclick: runAll }, "Run"),
        h("div", { id: "id-output", className: "w3-small w3-padding" }),
    ]);
};
