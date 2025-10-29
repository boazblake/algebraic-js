import { init } from "../model/init";
import { update } from "../model/update";
import { Layout } from "../views/layout/Layout";
export const program = {
    init,
    update,
    view: (m, dispatch) => Layout(m, dispatch),
};
