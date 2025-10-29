import type { Model, Msg } from "./types";

export const update = (msg: Msg, m: Model): { model: Model; effects?: any[] } => {
  switch (msg.type) {
    case "SET_VIEW":
      return { model: { ...m, activeView: msg.view } };

    case "SET_THEME":
      if (typeof document !== "undefined") {
        document.documentElement.classList.toggle("dark", msg.theme === "dark");
      }
      return { model: { ...m, theme: msg.theme } };

    case "RESIZE":
      return { model: { ...m, width: msg.width, height: msg.height } };

    case "ID_RESULT":
      return { model: { ...m, id: msg.value, idError: undefined } };
    case "ID_ERROR":
      return { model: { ...m, idError: msg.error } };

    case "IO_RUN":
      return { model: { ...m, ioValue: msg.value } };

    case "READER_RUN":
      return { model: { ...m, readerValue: msg.value, readerEnv: msg.env } };

    case "WRITER_UPDATE":
      return { model: { ...m, writerEffect: msg.writerEffect } };

    case "STATE_SET":
      return { model: { ...m, counter: msg.value } };

    case "TASK_DONE":
      return { model: { ...m, taskValue: msg.value } };

    case "VALIDATION_RUN":
      return { model: { ...m, validation: msg.result } };

    case "STREAM_NEXT":
      return { model: { ...m, streamLast: msg.value } };
    case "STREAM_START":
      return { model: { ...m, streamRunning: true } };
    case "STREAM_STOP":
      return { model: { ...m, streamRunning: false } };

    default:
      return { model: m };
  }
};
