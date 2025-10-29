import { h, Left, Right, runDomIO, writeToElement, browserEnv } from "effects-vdom";
import type { Model } from "../../model/types";

export const EitherEffect = (_m: Model, dispatch?: any) => {
  let json = `{"x": 42}`;

  const parse = (s: string) => {
    try { return Right(JSON.parse(s)); }
    catch (e: any) { return Left(`Parse error: ${e?.message ?? "unknown"}`); }
  };

  const run = () => {
    const e = parse(json);
    if (dispatch) dispatch({ type: "EITHER_RUN", input: json, result: e });
    const html =
      e._tag === "Right"
        ? `<li>Right: ${JSON.stringify(e.right)}</li>`
        : `<li>Left: ${e.left}</li>`;
    runDomIO(writeToElement("#either-output", `<ul>${html}</ul>`), browserEnv());
  };

  return h("section", { className: "w3-padding" }, [
    h("h3", {}, "Either"),
    h("textarea", {
      className: "w3-input w3-border w3-margin-bottom",
      rows: 4,
      value: json,
      oninput: (e: any) => (json = e.target.value),
    }),
    h("button", { className: "w3-button w3-theme", onclick: run }, "Parse"),
    h("div", { id: "either-output", className: "w3-small w3-padding" }),
  ]);
};
