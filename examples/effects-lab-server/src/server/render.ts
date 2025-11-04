import { renderToString,runDomIO,writeHtml, browserEnv } from "../../node_modules/effects-vdom/dist/core/index.js";
import { program } from "../browser/program.js";
import { serverDomEnv } from "./env.js";

export const renderPage = async () => {
    const env = serverDomEnv();
  const { model, effects } = program.init.run();
  for (const fx of effects ?? []) runDomIO(fx, env);
  const vnode = program.view(model, () => {});
  const html = renderToString(vnode);

  return `
<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8" />
    <title>Effects-Lab SSR</title>
    <script>window.__INITIAL_MODEL__ = ${JSON.stringify(model)}</script>
    <script type="module" src="/browser/main.js"></script>
    <script src="https://cdn.tailwindcss.com"></script>
  </head>
  <body class="bg-gray-50 text-gray-900 min-h-screen">
    <div id="app" class="p-6">${html}</div>
  </body>
</html>`;
};
