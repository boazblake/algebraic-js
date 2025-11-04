import { div, h1, button, section } from "../renderer.js";
import { ResourcePanel } from "./ResourcePanel.js";
export const Layout = (m, dispatch) => section({ className: "p-6 space-y-6" }, [
    div({ className: "flex justify-between items-center" }, [
        h1({ className: "text-3xl font-bold" }, "Effects-Lab Dashboard"),
        button({
            className: "bg-gray-800 text-white px-4 py-2 rounded",
            onclick: () => dispatch({ type: "TOGGLE_THEME" }),
        }, `Theme: ${m.theme}`),
    ]),
    ResourcePanel(m, dispatch),
]);
