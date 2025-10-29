import * as edom from "effects-vdom";
import { program } from "./program";
import type { Model, Msg } from "./model/types";

const root = document.getElementById("app")!;
const instance = edom.app<Model, Msg>(root, program);

window.addEventListener("resize", () =>
  instance.dispatch({
    type: "RESIZE",
    width: window.innerWidth,
    height: window.innerHeight,
  })
);
