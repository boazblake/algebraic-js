import { div, h1, pre, section } from "./utils/renderer";
import { program as CounterApp } from "./apps/counter/program";
import { program as TodoApp } from "./apps/todo/program";
import { program as WeatherApp } from "./apps/weather/program";
import type { Model, Msg } from "./types";

export const view = (m: Model, dispatch: (msg: Msg) => void) =>
  div(
    {
      className:
        "min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-4 sm:p-6 md:p-8",
    },
    [
      // Header
      h1(
        {
          className:
            "text-3xl md:text-4xl font-bold mb-6 text-center text-gray-800",
        },
        "Fractal Composition Dashboard"
      ),

      // Responsive grid of sub-app panels
      div(
        {
          className:
            "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 place-items-stretch transition-all",
        },
        [
          section({ className: panelClass() }, [
            h1({ className: titleClass() }, "Counter App"),
            CounterApp.view(m.counter, (msg) =>
              dispatch({ type: "Counter", msg })
            ),
          ]),

          section({ className: panelClass() }, [
            h1({ className: titleClass() }, "Todo App"),
            TodoApp.view(m.todo, (msg) => dispatch({ type: "Todo", msg })),
          ]),

          section({ className: panelClass() }, [
            h1({ className: titleClass() }, "Weather App"),
            WeatherApp.view(m.weather, (msg) =>
              dispatch({ type: "Weather", msg })
            ),
          ]),
        ]
      ),

      // JSON debug / full app model view
      div(
        {
          className:
            "mt-8 w-full overflow-hidden rounded-xl shadow-lg border border-gray-200 bg-gray-900",
        },
        [
          h1(
            {
              className:
                "text-lg font-semibold p-4 text-emerald-400 bg-gray-800 border-b border-gray-700",
            },
            "Full App State"
          ),
          pre(
            {
              className:
                "text-xs md:text-sm font-mono text-gray-100 p-4 overflow-x-auto whitespace-pre-wrap",
            },
            JSON.stringify(m, null, 2)
          ),
        ]
      ),
    ]
  );

// Shared panel styling
const panelClass = () =>
  "bg-white rounded-2xl shadow-md p-6 flex flex-col hover:shadow-xl hover:scale-[1.01] transition-transform border border-gray-100 justify-center";

// Shared title styling
const titleClass = () =>
  "text-lg font-semibold text-gray-700 mb-4 border-b border-gray-200 pb-2";
