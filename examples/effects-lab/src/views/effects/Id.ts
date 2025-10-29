import { h, Id } from "effects-vdom";
import type { Model, Msg } from "../../model/types";

export const IdEffect = (_m: Model, dispatch: (msg: Msg) => void) => {
  let input = "5";
  let fnStr = "x => x + 1";

  const compute = () => {
    try {
      const num = Number(input);
      const fn = eval(fnStr) as (x: number) => number;
      const value = Id.of(num);
      const mapped = value.map(fn);
      const chained = value.chain((x) => Id.of(fn(x)));
      dispatch({
        type: "ID_RESULT",
        value: {
          input: num,
          mapped: mapped.run(),
          chained: chained.run(),
        },
      });
    } catch {
      dispatch({ type: "ID_ERROR", error: "Invalid function." });
    }
  };

  return h("section", { className: "w3-padding" }, [
    h("h3", {}, "Identity Monad"),
    h("input", {
      className: "w3-input w3-border w3-margin-bottom",
      value: input,
      oninput: (e: any) => (input = e.target.value),
    }),
    h("input", {
      className: "w3-input w3-border w3-margin-bottom",
      value: fnStr,
      oninput: (e: any) => (fnStr = e.target.value),
    }),
    h("button", { className: "w3-button w3-theme", onclick: compute }, "Run"),
  ]);
};
