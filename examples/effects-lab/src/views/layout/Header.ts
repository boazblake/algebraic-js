import { h ,Dispatch} from "effects-vdom";
import {Model} from '../../model/types'

export const Header = (m:Model, dispatch:Dispatch) =>
  h("header", { className: "w3-container w3-theme w3-padding" }, [
    h("h3", {}, "Effects Lab"),
    h("button", {
      className: "w3-button w3-white w3-right",
      onclick: () => dispatch({
        type: "SET_THEME",
        theme: m.theme === "light" ? "dark" : "light",
      }),
    }, m.theme === "light" ? "Dark Mode" : "Light Mode"),
  ]);
