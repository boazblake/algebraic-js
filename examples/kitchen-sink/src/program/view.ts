import { h } from "effects-vdom";
import type { Model, Msg } from "./types";
import { KitchenSink } from "../kitchenSink";



const view = (m: Model, dispatch: (msg: Msg) => void) => {
  const isMobile = m.width < 992;
  const Header = () =>
    h(
      "header",
      {
        className:
          "bar top clouds border-bottom padding-small card",
        role: "banner",
      },
      h(
        "button",
        {
          className: "bar-item button hide-large",
          onclick: () => dispatch({ type: "TOGGLE_SIDEBAR" }),
          "aria-label": "Toggle navigation menu",
          "aria-expanded": String(m.sidebarOpen),
          "aria-controls": "sidebar",
        },
        "☰"
      ),
      h(
        "h1",
        {
          className: "bar-item large margin-right",
          role: "heading",
          "aria-level": "1",
        },
        "Kitchen Sink"
      ),
      h(
        "div",
        { className: "bar-item right" },
h(
  "div",
  { className: "dropdown-hover" },
  h(
    "button",
    {
      className: "button border",
      "aria-haspopup": "listbox",
      "aria-expanded": "false",
    },
    "Select Theme ▾"
  ),
  h(
    "div",
    {
      style: "position:fixed!important",
      className:
        "dropdown-content bar-block card white animate-opacity",
      role: "listbox",
    },
    [
      "green",
      "blue",
      "purple",
      "red",
      "teal",
      "indigo",
      "cyan",
      "orange",
    ].map((color) =>
      h(
        "a",
        {
          href: "#",
          className: "bar-item button",
          role: "option",
          "aria-label": `Switch to ${color} theme`,
          onclick: (e: MouseEvent) => {
            e.preventDefault();
            // find or create link
            let themeLink = document.querySelector<HTMLLinkElement>(
              'link[data-theme]'
            );
            if (!themeLink) {
              themeLink = document.createElement("link");
              themeLink.rel = "stylesheet";
              themeLink.dataset.theme = "true";
              document.head.appendChild(themeLink);
            }
            themeLink.href = `https://www.w3schools.com/lib/w3-theme-${color}.css`;
            dispatch({ type: "SET_THEME", theme: color });
          },
        },
        color[0].toUpperCase() + color.slice(1)
      )
    )
  )
)
      )
    );

  const Sidebar = () =>
    h(
      "aside",
      {
        id: "sidebar",
        className:
          "sidebar bar-block white animate-left border-right" +
          (isMobile && !m.sidebarOpen ? " hide" : ""),
        style: "width:250px;",
        role: "navigation",
        "aria-label": "Component navigation",
        "aria-hidden": isMobile ? String(!m.sidebarOpen) : "false",
      },
      h(
        "ul",
        { className: "ul", role: "menu" },
        ["Buttons", "Alerts", "Cards", "Inputs", "Tables", "Progress Bar", "Tabs","Modal"].map(
          (name) =>
            h(
              "li",
              { role: "none" },
              h(
                "a",
                {
                  href: `#${name.toLowerCase()}`,
                  className: "bar-item button",
                  role: "menuitem",
                  "aria-label": `Go to ${name} section`,
                  onclick: () => {
                    if (isMobile)
                      setTimeout(() => dispatch({ type: "TOGGLE_SIDEBAR" }), 150);
                  },
                },
                name
              )
            )
        )
      )
    );

  const Overlay = () =>
    isMobile && m.sidebarOpen
      ? h("div", {
          className: "overlay animate-opacity",
          onclick: () => dispatch({ type: "TOGGLE_SIDEBAR" }),
          role: "presentation",
          "aria-hidden": "true",
        })
      : null;

  const Main = () =>
    h(
      "main",
      {
        className: "main",
        style: isMobile ? "" : "margin-left:250px",
        id: "main-content",
        role: "main",
      },
      h(
        "div",
        {style:"margin-top:30px !important" ,className: "container padding-large", "aria-live": "polite" },
        KitchenSink(m, dispatch)
      )
    );

  return h(
    "div",
    {
      className: "display-container light-grey",
      role: "application",
      "aria-label": "Kitchen Sink Demo Application",
    },
    Header(),
    Sidebar(),
    Overlay(),
    Main()
  );
};

