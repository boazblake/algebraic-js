import { h, IO } from "effects-vdom";
import { IdEffect } from "../effects/Id";
import { IOEffect } from "../effects/IO";
import { MaybeEffect } from "../effects/Maybe";
import { EitherEffect } from "../effects/Either";
import { ReaderEffect } from "../effects/Reader";
import { WriterEffect } from "../effects/Writer";
import { StateEffect } from "../effects/State";
import { TaskEffect } from "../effects/Task";
import { ValidationEffect } from "../effects/Validation";
import { StreamEffect } from "../effects/Stream";
import { CompositionEffect } from "../effects/Composition";
const effects = new Map([
    ["Id", IdEffect],
    ["IO", IOEffect],
    ["Maybe", MaybeEffect],
    ["Either", EitherEffect],
    ["Reader", ReaderEffect],
    ["Writer", WriterEffect],
    ["State", StateEffect],
    ["Task", TaskEffect],
    ["Validation", ValidationEffect],
    ["Stream", StreamEffect],
    ["Composition", CompositionEffect],
]);
export const Layout = (m, dispatch) => {
    const Active = effects.get(m.activeView) ?? IO(() => "No active effect").run();
    // Sidebar rendered via IO for controlled side-effect
    const SidebarIO = IO(() => h("aside", { className: "w3-third w3-border-right" }, [
        h("h3", { className: "w3-center w3-padding" }, "Effects Lab"),
        h("ul", { className: "w3-ul w3-hoverable" }, Array.from(effects.keys()).map((name) => h("li", {
            className: "w3-hover-theme w3-padding-small" +
                (m.activeView === name ? " w3-theme-l3" : ""),
            onclick: () => dispatch({ type: "SET_VIEW", view: name }),
        }, name))),
    ]));
    return h("div", { className: "w3-row-padding" }, [
        SidebarIO.run(),
        h("main", { className: "w3-twothird w3-container" }, typeof Active === "function"
            ? Active(m, dispatch)
            : h("p", {}, String(Active))),
    ]);
};
