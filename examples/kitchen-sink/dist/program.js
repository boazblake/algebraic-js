import { h, IO } from "effects-vdom";
import { KitchenSink } from "./kitchenSink";
export const init = IO(() => ({
    model: {
        // Individual effects
        readerOutput: undefined,
        writer: [],
        validationInput: "",
        validationError: undefined,
        validationSuccess: false,
        taskLoading: false,
        taskResult: undefined,
        // Compositions
        readerWriterResult: undefined, // Reader→Writer composition output
        validatedTaskStatus: undefined, // Validation→Task pipeline state or error
        // UI state
        activeTab: "Overview",
        sidebarOpen: false,
        showModal: false,
        width: window.innerWidth,
        height: window.innerHeight,
        theme: "light",
        // Animation / visualization
        lastEffect: "none", // "reader" | "writer" | "validation" | "task" | "readerWriter" | "validatedTask"
    },
    effects: [],
}));
export const update = (msg, m) => {
    switch (msg.type) {
        case "READER_RUN":
            return { model: { ...m, readerOutput: msg.env } };
        case "WRITER_APPEND":
            return { model: { ...m, writer: [...m.writer, msg.message] } };
        case "VALIDATION_INPUT": {
            const valid = /^[^@]+@[^@]+\.[^@]+$/.test(msg.value);
            return {
                model: {
                    ...m,
                    validationInput: msg.value,
                    validationSuccess: valid,
                    validationError: valid ? undefined : "Invalid email",
                },
            };
        }
        case "TASK_RUN":
            return {
                model: { ...m, taskLoading: true, taskResult: undefined },
                effects: [
                    {
                        run: () => setTimeout(() => dispatch({ type: "TASK_RESOLVE", result: "Task completed Successfully" }), 1500),
                    },
                ],
            };
        case "TASK_RESOLVE":
            return { model: { ...m, taskLoading: false, taskResult: msg.result } };
        case "OPEN_MODAL":
            return { model: { ...m, showModal: true } };
        case "CLOSE_MODAL":
            return { model: { ...m, showModal: false } };
        case "TOGGLE_SIDEBAR":
            return { model: { ...m, sidebarOpen: !m.sidebarOpen } };
        case "RESIZE":
            return { model: { ...m, width: msg.width, height: msg.height } };
        case "TOGGLE_THEME": {
            const next = m.theme === "light" ? "dark" : "light";
            document.documentElement.classList.toggle("dark", next === "dark");
            return { model: { ...m, theme: next } };
        }
        case "SET_THEME":
            document.documentElement.classList.toggle("dark", msg.theme === "dark");
            return { model: { ...m, theme: msg.theme } };
        case "READER_WRITER_RUN": {
            const env = msg.env;
            return {
                model: {
                    ...m,
                    readerOutput: env,
                    writer: [...m.writer, `Read environment: ${env}`],
                },
            };
        }
        case "VALIDATED_TASK_RUN":
            if (!m.validationSuccess)
                return { model: { ...m, validationError: "Cannot run task: invalid email" } };
            return {
                model: { ...m, taskLoading: true, taskResult: undefined },
                effects: [
                    {
                        run: () => setTimeout(() => window.dispatch({
                            type: "TASK_RESOLVE",
                            result: `Task complete for ${m.validationInput}`,
                        }), 1200),
                    },
                ],
            };
            ;
        default:
            return { model: m };
    }
};
const view = (m, dispatch) => {
    const isMobile = m.width < 992;
    window.dispatch = dispatch;
    const Header = () => h("header", {
        className: "bar top clouds border-bottom padding-small card",
        role: "banner",
    }, h("button", {
        className: "bar-item button hide-large",
        onclick: () => dispatch({ type: "TOGGLE_SIDEBAR" }),
        "aria-label": "Toggle navigation menu",
        "aria-expanded": String(m.sidebarOpen),
        "aria-controls": "sidebar",
    }, "☰"), h("h1", {
        className: "bar-item large margin-right",
        role: "heading",
        "aria-level": "1",
    }, "Kitchen Sink"), h("div", { className: "bar-item right" }, h("div", { className: "dropdown-hover" }, h("button", {
        className: "button border",
        "aria-haspopup": "listbox",
        "aria-expanded": "false",
    }, "Select Theme ▾"), h("div", {
        style: "position:fixed!important",
        className: "dropdown-content bar-block card white animate-opacity",
        role: "listbox",
    }, [
        "green",
        "blue",
        "purple",
        "red",
        "teal",
        "indigo",
        "cyan",
        "orange",
    ].map((color) => h("a", {
        href: "#",
        className: "bar-item button",
        role: "option",
        "aria-label": `Switch to ${color} theme`,
        onclick: (e) => {
            e.preventDefault();
            // find or create link
            let themeLink = document.querySelector('link[data-theme]');
            if (!themeLink) {
                themeLink = document.createElement("link");
                themeLink.rel = "stylesheet";
                themeLink.dataset.theme = "true";
                document.head.appendChild(themeLink);
            }
            themeLink.href = `https://www.w3schools.com/lib/theme-${color}.css`;
            dispatch({ type: "SET_THEME", theme: color });
        },
    }, color[0].toUpperCase() + color.slice(1)))))));
    const Sidebar = () => h("aside", {
        id: "sidebar",
        className: "sidebar bar-block white animate-left border-right" +
            (isMobile && !m.sidebarOpen ? " hide" : ""),
        style: "width:250px;",
        role: "navigation",
        "aria-label": "Component navigation",
        "aria-hidden": isMobile ? String(!m.sidebarOpen) : "false",
    }, h("ul", { className: "ul", role: "menu" }, ["Buttons", "Alerts", "Cards", "Inputs", "Tables", "Progress Bar", "Tabs", "Modal"].map((name) => h("li", { role: "none" }, h("a", {
        href: `#${name.toLowerCase()}`,
        className: "bar-item button",
        role: "menuitem",
        "aria-label": `Go to ${name} section`,
        onclick: () => {
            if (isMobile)
                setTimeout(() => dispatch({ type: "TOGGLE_SIDEBAR" }), 150);
        },
    }, name)))));
    const Overlay = () => isMobile && m.sidebarOpen
        ? h("div", {
            className: "overlay animate-opacity",
            onclick: () => dispatch({ type: "TOGGLE_SIDEBAR" }),
            role: "presentation",
            "aria-hidden": "true",
        })
        : null;
    const Main = () => h("main", {
        className: "main",
        style: isMobile ? "" : "margin-left:250px",
        id: "main-content",
        role: "main",
    }, h("div", { style: "margin-top:30px !important", className: "container padding-large", "aria-live": "polite" }, KitchenSink(m, dispatch)));
    return h("div", {
        className: "display-container light-grey",
        role: "application",
        "aria-label": "Kitchen Sink Demo Application",
    }, Header(), Sidebar(), Overlay(), Main());
};
export const program = { init, update, view };
