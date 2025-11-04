import m from "mithril";
import type { Model, Msg } from "./types";

export const view = (model: Model, dispatch: (msg: Msg) => void) =>
  m("div.p-6.text-center.space-y-4", [
    m("h1.text-3xl.font-bold", `Count: ${model.count}`),
    m("div.space-x-3", [
      m(
        "button.bg-blue-600.text-white.px-4.py-2.rounded",
        { onclick: () => dispatch({ type: "INCREMENT" }) },
        "+"
      ),
      m(
        "button.bg-red-600.text-white.px-4.py-2.rounded",
        { onclick: () => dispatch({ type: "DECREMENT" }) },
        "-"
      ),
    ]),
    m(
      "button.bg-gray-800.text-white.px-4.py-2.rounded",
      { onclick: () => dispatch({ type: "TOGGLE_THEME" }) },
      `Theme: ${model.theme}`
    ),
    m("p.text-sm.text-gray-500", `Viewport: ${model.width} × ${model.height}`),
  ]);
