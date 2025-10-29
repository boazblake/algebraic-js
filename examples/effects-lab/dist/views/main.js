import { app } from "effects-vdom";
import { program } from "./program/index";
const root = document.getElementById("app");
const instance = app(root, program);
window.addEventListener("resize", () => instance.dispatch({
    type: "RESIZE",
    width: window.innerWidth,
    height: window.innerHeight,
}));
