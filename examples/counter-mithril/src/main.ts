import m from "mithril";
import { renderApp } from "effects-vdom";
import type { Program } from "effects-vdom";
import { init } from "./init";
import { update } from "./update";
import { view } from "./view";
import type { Model, Msg } from "./types";
import { registerGlobalIO } from "./utils";

export const program: Program<Model, Msg> = {
  init,
  update,
  view,
};

const renderer = (root: Element, vnode: any) => m.render(root.run(), vnode);
const root = IO(() => document.getElementById("app"))!;

const app = renderApp(renderer)(root, program).run();
registerGlobalIO(app.dispatch).forEach((io) => io.run());
