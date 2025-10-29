import { Writer, updateValueAndLog } from "effects-vdom";
import type { Model, Msg } from "./types";


export const update = (msg: Msg, m: Model): { model: Model; effects?: any[] } => {
  switch (msg.type) {
    case "READER_RUN":
      return { model: { ...m, readerOutput: msg.env } };

case "WRITER_APPEND": {


  const newWriter = updateValueAndLog(m.writer, msg.message);
  return { model: { ...m, writer: newWriter } };
}



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
            run: () =>
              setTimeout(
                () => window.dispatch({ type: "TASK_RESOLVE", result: "Task completed Successfully" }),
                1500
              ),
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
  const writer2 = updateValueAndLog(m.writer, `Read environment: ${env}`);
  return { model: { ...m, readerOutput: env, writer: writer2 } };
}

case "VALIDATED_TASK_RUN":
  if (!m.validationSuccess)
    return { model: { ...m, validationError: "Cannot run task: invalid email" } };
  return {
    model: { ...m, taskLoading: true, taskResult: undefined },
    effects: [
      {
        run: () =>
          setTimeout(
            () =>
              window.dispatch({
                type: "TASK_RESOLVE",
                result: `Task complete for ${m.validationInput}`,
              }),
            1200
          ),
      },
    ],
  };;

    default:
      return { model: m };
  }
};
