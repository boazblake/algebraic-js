import { h, Writer } from "effects-vdom";
import type { Model, Msg } from "../../model/types";

export const WriterEffect = (m: Model, dispatch: (msg: Msg) => void) => {
  const [value, logs] = m.writerEffect.run();

  const appendLog = () => {
    const msg = `Log entry @ ${new Date().toLocaleTimeString()}`;
    const newWriter = Writer(() => [msg, [...logs, msg]]);
    dispatch({ type: "WRITER_UPDATE", writerEffect: newWriter });
  };

  return h("section", { className: "w3-padding" }, [
    h("h3", {}, "Writer Monad"),
    h("button", { className: "w3-button w3-theme", onclick: appendLog }, "Append Log"),
    h("ul", { className: "w3-ul w3-small" }, logs.map((l) => h("li", {}, l))),
    h("pre", { className: "w3-small w3-margin-top" }, [
      `Value: ${value}\nLogs: ${JSON.stringify(logs)}`,
    ]),
  ]);
};
