import * as edom from "effects-vdom";
import  * as program from "./program";
import { Model, Msg } from "./types";

const root = document.getElementById("app")!;
const instance = edom.app<Model, Msg>(root, program);

window.addEventListener("resize", () =>
  instance.dispatch({
    type: "RESIZE",
    width: window.innerWidth,
    height: window.innerHeight,
  })
);
