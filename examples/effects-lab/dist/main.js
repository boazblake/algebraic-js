import * as edom from "effects-vdom";
import { program } from "./program";
const root = document.getElementById("app");
const instance = edom.app(root, program);
window.addEventListener("resize", () => instance.dispatch({
    type: "RESIZE",
    width: window.innerWidth,
    height: window.innerHeight,
}));
