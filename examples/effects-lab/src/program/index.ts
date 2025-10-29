import { init } from "../model/init";
import { update } from "../model/update";
import { Layout } from "../views/layout/Layout";
import type { Model, Msg } from "../model/types";

export const program = {
  init,
  update,
  view: (m: Model, dispatch: (msg: Msg) => void) => Layout(m, dispatch),
};
