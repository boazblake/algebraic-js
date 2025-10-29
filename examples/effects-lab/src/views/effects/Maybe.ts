import { h, Just, Nothing, runDomIO, writeToElement, browserEnv } from "effects-vdom";
import type { Model } from "../../model/types";

export const MaybeEffect = (_m: Model, dispatch?: any) => {
  let a = "10";
  let b = "2";

  const safeDiv = (x: number, y: number) => (y === 0 ? Nothing() : Just(x / y));

  const run = () => {
    const e = safeDiv(Number(a), Number(b));
    if (dispatch) dispatch({ type: "MAYBE_RUN", input: { a: Number(a), b: Number(b) }, result: e });
    const html =
      e._tag === "Just"
        ? `<li>Result: ${e.value}</li>`
        : `<li>Nothing</li>`;
    runDomIO(writeToElement("#maybe-output", `<ul>${html}</ul>`), browserEnv());
  };

  return h("section", { className: "w3-padding" }, [
    h("h3", {}, "Maybe"),
    h("div", { className: "w3-row-padding" }, [
      h("div", { className: "w3-half" }, [
        h("input", {
          className: "w3-input w3-border w3-margin-bottom",
          value: a,
          oninput: (e: any) => (a = e.target.value),
          placeholder: "a",
        }),
      ]),
      h("div", { className: "w3-half" }, [
        h("input", {
          className: "w3-input w3-border w3-margin-bottom",
          value: b,
          oninput: (e: any) => (b = e.target.value),
          placeholder: "b",
        }),
      ]),
    ]),
    h("button", { className: "w3-button w3-theme", onclick: run }, "Divide"),
    h("div", { id: "maybe-output", className: "w3-small w3-padding" }),
  ]);
};
