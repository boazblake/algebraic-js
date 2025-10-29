import { h, Reader, IO } from "effects-vdom";
import type { Model, Msg } from "../../model/types";

type Env = { api: string };

export const ReaderEffect = (_m: Model, dispatch: (msg: Msg) => void) => {
  let api = "https://api.example.com";

  const runReader = () => {
    const ask = Reader<Env, string>((env) => `Read from ${env.api}`);
    const composed = ask.map((s) => `${s} ✓`).chain((s) => IO(() => s));
    const result = composed.run({ api });
    dispatch({ type: "READER_RUN", value: result, env: { api } });
  };

  return h("section", { className: "w3-padding" }, [
    h("h3", {}, "Reader Monad"),
    h("input", {
      className: "w3-input w3-border w3-margin-bottom",
      value: api,
      oninput: (e: any) => (api = e.target.value),
    }),
    h("button", { className: "w3-button w3-theme", onclick: runReader }, "Run Reader"),
  ]);
};
