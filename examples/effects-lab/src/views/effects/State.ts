import { h, State } from "effects-vdom";
import type { Model, Msg } from "../../model/types";

export const StateEffect = (m: Model, dispatch: (msg: Msg) => void) => {
  const increment = () => {
    const s = State<number, number>((c) => [c + 1, c + 1]);
    const [val, next] = s.run(m.counter);
    dispatch({ type: "STATE_SET", value: next, last: val });
  };

  const decrement = () => {
    const s = State<number, number>((c) => [c - 1, c - 1]);
    const [val, next] = s.run(m.counter);
    dispatch({ type: "STATE_SET", value: next, last: val });
  };

  return h("section", { className: "w3-padding" }, [
    h("h3", {}, "State Monad"),
    h("div", { className: "w3-bar w3-margin-bottom" }, [
      h("button", { className: "w3-button w3-theme", onclick: increment }, "+"),
      h("button", { className: "w3-button w3-theme w3-margin-left", onclick: decrement }, "−"),
    ]),
    h("pre", {}, `Count: ${m.counter ?? 0}`),
  ]);
};
