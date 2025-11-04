import { renderApp ,IO} from "effects-vdom";
import {renderer} from './renderer'
import type { Program } from "effects-vdom";
import { init } from "./init";
import { update } from "./update";
import { view } from './view'
import type { Model, Msg } from "./types";
import {registerGlobalIO} from './utils'

export const program: Program<Model, Msg> = {
  init,
  update,
  view,
};

const root = IO(() => document.getElementById("app"))

const app = renderApp(renderer)(root, program).run();
registerGlobalIO(app.dispatch).forEach(io => io.run())

