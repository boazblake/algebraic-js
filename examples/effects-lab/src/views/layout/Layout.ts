import { h } from "effects-vdom";
import type { Model, Msg } from "../../model/types";
import { effects } from "../effects";

export const Layout = (m: Model, dispatch: (msg: Msg) => void) => {
  const Active = effects.get(m.activeView) ?? effects.values().next().value;

  return h("div", { className: "w3-row-padding" }, [
    h("aside", { className: "w3-third w3-border-right" }, [
      h("h3", {}, "Effects-Lab"),
      h(
        "ul",
        { className: "w3-ul" },
        Array.from(effects.keys()).map((name) =>
          h(
            "li",
            {
              className: "w3-hover-theme" + (m.activeView === name ? " w3-theme-l4" : ""),
              onclick: () => dispatch({ type: "SET_VIEW", view: name }),
            },
            name
          )
        )
      )
    ]),
    h("main", { className: "w3-twothird" }, Active(m, dispatch)),
      h("pre", { className: "w3-small w3-padding w3-border-top" }, JSON.stringify({
        view: m.activeView,
        id: m.id ?? null,
        io: m.ioValue ?? null,
        reader: { env: m.readerEnv ?? null, value: m.readerValue ?? null },
        writer: m.writerEffect.run(),
        counter: m.counter,
        task: m.taskValue ?? null,
        validation: m.validation ?? null,
        stream: { last: m.streamLast ?? null, running: m.streamRunning },
      }, null, 2)),
  ]);
};
