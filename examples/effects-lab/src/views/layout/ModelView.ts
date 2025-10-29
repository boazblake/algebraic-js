import { h } from "effects-vdom";
import type {Model} from '../../model/types'

export const ModelView = (m:Model) =>
  h("pre", { className: "w3-small w3-padding w3-light-grey" }, [
    JSON.stringify(m, null, 2),
  ]);
