import { h, IO } from "effects-vdom";
import type { Model, Msg } from "../../model/types";

export const IOEffect = (_m: Model, dispatch: (msg: Msg) => void) => {
  const runIO = () => {
    const io = IO(() => `Effect executed at ${new Date().toISOString()}`);
    dispatch({ type: "IO_RUN", value: io.run() });
  };

  return h("section", { className: "w3-padding" }, [
    h("h3", {}, "IO Monad"),
    h("button", { className: "w3-button w3-theme", onclick: runIO }, "Run IO"),
  ]);
};
