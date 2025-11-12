import { div, h1, input, button, ul, li, span } from "../../utils/renderer";
import type { Model, Msg } from "./types";

export const view = (m: Model, dispatch: (msg: Msg) => void) =>
  div({ className: "flex flex-col space-y-4" }, [
    h1({ className: "text-lg font-semibold text-sky-600" }, "Todos"),

    div({ className: "flex space-x-2" }, [
      input({
        className:
          "flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-sky-500",
        value: m.input,
        placeholder: "Add new todo...",
        oninput: (e: any) =>
          dispatch({ type: "SET_INPUT", value: e.target.value }),
      }),
      button(
        {
          className:
            "bg-sky-500 hover:bg-sky-600 text-white px-4 py-2 rounded-lg shadow transition",
          onclick: () => dispatch({ type: "ADD" }),
        },
        "Add"
      ),
    ]),

    ul(
      {
        className:
          "divide-y divide-gray-200, overflow-y-auto max-h-40 min-h-40 justify-center",
      },
      m.todos.map((todo, idx) => {
        console.log(todo);
        return li({ className: "flex items-center justify-between py-2" }, [
          span(
            {
              id: todo.id + String(todo.done),
              className: `text-gray-800 text-sm truncate ${todo.done ? "line-through text-gray-400" : ""}`,
            },
            todo.text
          ),
          button(
            {
              className:
                "text-xs text-red-500 hover:text-red-700 font-medium transition",
              onclick: () => dispatch({ type: "TOGGLE", id: todo.id }),
            },
            "✕"
          ),
        ]);
      })
    ),
  ]);
