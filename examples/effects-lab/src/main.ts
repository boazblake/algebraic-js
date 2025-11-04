import { renderApp, browserEnv, runDomIO, IO } from "effects-vdom";
import { renderer } from "./renderer";
import { program } from "./program";
import { registerGlobalIO } from "./utils/globalIO";

const root = IO(() => document.getElementById("app")!);

const app = renderApp(renderer)(root, program);

const main = app.chain((app) =>
  IO(() => {
    const resizeEffect = registerGlobalIO(app.dispatch);
    runDomIO(resizeEffect, browserEnv());
  })
);

// Execute
main.run();
