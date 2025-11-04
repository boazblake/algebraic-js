import {
  renderApp,
  browserEnv,
  runDomIO,
} from "../../node_modules/effects-vdom/dist/core/index.js";
import { Writer, IO } from "../../node_modules/effects-vdom/dist/adt/index.js";
import { renderer } from "../shared/renderer.js";
import { program } from "./program.js";
import { registerGlobalIO } from "../shared/utils/globalIO.js";
import type { Model } from "../model/types";

const hydrateLogs = (raw: any) =>
  raw?.logs && typeof raw.logs.run === "function"
    ? raw.logs
    : Writer.of("", []);

const hydrateEnv = IO(() => ({
  fetch: window.fetch.bind(window),
  baseUrl: "https://jsonplaceholder.typicode.com",
  window,
  document,
  localStorage,
}));

const hydrateModel = IO(() => {
  const raw = window.__INITIAL_MODEL__;
  const logs = hydrateLogs(raw);
  const env = hydrateEnv.run();
  return { ...raw, env, logs } as Model;
});

const rootIO = IO(() => document.getElementById("app")!);

// pass the IO into renderApp
export const app = renderApp(renderer)(rootIO, {
  ...program,
  init: {
    run: () => {
      const model = hydrateModel.run();
      return { model, effects: [] };
    },
  },
});

const resizeEffect = registerGlobalIO(app.run().dispatch);
runDomIO(resizeEffect, browserEnv());
