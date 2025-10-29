import {
  h, Reader, Task, Writer, Right, IO,
  runDomIO, writeToElement, browserEnv,
} from "effects-vdom";
import type { Model } from "../../model/types";

type Env = { user: string };

export const CompositionEffect = (_m: Model, dispatch?: any) => {
  let user = "alice";

  const run = async () => {
    const ask = Reader<Env, string>((e) => `hello ${e.user}`);

    const task = (s: string) =>
      Task(() =>
        new Promise((resolve) => setTimeout(() => resolve(Right(`${s} • task ok`)), 500))
      );

    const writer = (s: string) =>
      Writer<string[], string>(() => [s, [`log: ${s}`]]);

    const ioify = (s: string) => IO(() => `IO: ${s}`);

    const result = await task(ask.run({ user })).run();  // Either
    const html =
      result._tag === "Right"
        ? (() => {
            const w = writer(result.right);
            const [val, logs] = w.run();
            const io = ioify(val).run();
            return `<ul>
              <li>Reader→Task: ${result.right}</li>
              <li>Writer value: ${val}</li>
              <li>Writer logs: ${JSON.stringify(logs)}</li>
              <li>${io}</li>
            </ul>`;
          })()
        : `<ul><li>Error: ${JSON.stringify(result.left)}</li></ul>`;

    if (dispatch) dispatch({ type: "COMPOSED_RUN", env: { user }, result });
    runDomIO(writeToElement("#composition-output", html), browserEnv());
  };

  return h("section", { className: "w3-padding" }, [
    h("h3", {}, "Composition"),
    h("input", {
      className: "w3-input w3-border w3-margin-bottom",
      value: user,
      oninput: (e: any) => (user = e.target.value),
      placeholder: "user",
    }),
    h("button", { className: "w3-button w3-theme", onclick: run }, "Run pipeline"),
    h("div", { id: "composition-output", className: "w3-small w3-padding" }),
  ]);
};
