import { h, Stream } from "effects-vdom";
import type { Model, Msg } from "../../model/types";

export const StreamEffect = (_m: Model, dispatch: (msg: Msg) => void) => {
  let sub: { unsubscribe: () => void } | null = null;

  const start = () => {
    let x = 0;
    const s = Stream<number>((emit) => {
      const id = setInterval(() => emit.next(x++), 400);
      return { unsubscribe: () => clearInterval(id) };
    });
    sub = s.subscribe({ next: (n) => dispatch({ type: "STREAM_NEXT", value: n }) });
    console.log('sub start', sub)
  };

  const stop = () => {
    console.log('stop',sub)
    sub?.unsubscribe();
  };

  return h("section", { className: "w3-padding" }, [
    h("h3", {}, "Stream Monad"),
    h("div", { className: "w3-bar w3-margin-bottom" }, [
      h("button", { className: "w3-button w3-theme", onclick: start }, "Start"),
      h("button", { className: "w3-button w3-theme w3-margin-left", onclick: stop }, "Stop"),
    ]),
  ]);
};
