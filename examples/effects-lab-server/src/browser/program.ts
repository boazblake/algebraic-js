import { init } from "../model/init.js";
import { update } from "../model/update.js";
import { Layout } from "../shared/views/Layout.js";
import type { Model, Msg } from "../model/types.js";
import type { Program } from "../../node_modules/effects-vdom/dist/core/index.js";

export const program: Program<Model, Msg> = {
  init,
  update,
  view: Layout,
};
