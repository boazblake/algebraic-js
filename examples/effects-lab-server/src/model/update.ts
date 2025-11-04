import {
  Reader,
  Task,
  Either,
  Writer,
  IO,
} from "../../node_modules/effects-vdom/dist/adt/index.js";
import { httpTask } from "../../node_modules/effects-vdom/dist/core/index.js";
import type { Model, Msg, Env } from "./types.js";

export const update = (msg: Msg, m: Model, dispatch: (msg: Msg) => void) => {
  switch (msg.type) {
    case "SET_ACTIVE":
      return { model: { ...m, active: msg.key } };

    case "FETCH_RESOURCE": {
      const key = msg.key;
      const { limit } = m[key];
      const task = httpTask<any[]>(`/${key}?_page=1&_limit=${limit}`).run(
        m.env
      );

      const io = IO(async () => {
        const res = await task.run();
        if (res._tag === "Right")
          dispatch({ type: "FETCH_SUCCESS", key, data: res.right, page: 1 });
        else
          dispatch({
            type: "FETCH_ERROR",
            key,
            error:
              "status" in res.left
                ? res.left
                : { status: 0, message: res.left.message || "unknown err"},
          });
      });

      return {
        model: {
          ...m,
          [key]: { ...m[key], loading: true },
        },
        effects: [io],
      };
    }

    case "FETCH_PAGE": {
      const key = msg.key;
      const page = msg.page;
      const { limit } = m[key];
      const task = httpTask<any[]>(`/${key}?_page=${page}&_limit=${limit}`).run(
        m.env
      );

      const io = IO(async () => {
        const res = await task.run();
        if (res._tag === "Right") {
          dispatch({ type: "FETCH_SUCCESS", key, data: res.right, page });
        } else {
          dispatch({
            type: "FETCH_ERROR",
            key,
            error:
              "status" in res.left
                ? res.left
                : { status: 0, message: res.left.message || "Unknown error" },
          });
        }
      });

      return {
        model: {
          ...m,
          [key]: { ...m[key], loading: true },
        },
        effects: [io],
      };
    }

    case "FETCH_SUCCESS": {
      const key = msg.key;
      const logs = m.logs.chain(() =>
        Writer(() => ["", [`Fetched ${key} page ${msg.page || 1}`]])
      );

      return {
        model: {
          ...m,
          [key]: {
            ...m[key],
            data: [...msg.data],
            loading: false,
            page: msg.page || 1,
          },
          logs,
        },
      };
    }

    case "FETCH_ERROR": {
      const logs = m.logs.chain(() =>
        Writer(() => ["", [`Error fetching ${msg.key}: ${msg.error}`]])
      );
      return {
        model: {
          ...m,
          [msg.key]: { ...m[msg.key], loading: false, error: msg.error },
          logs,
        },
      };
    }

    case "TOGGLE_THEME": {
      const next: "light" | "dark" = m.theme === "light" ? "dark" : "light";
      document.documentElement.classList.toggle("dark", next === "dark");
      return { model: { ...m, theme: next } };
    }

    default:
      return { model: m };
  }
};
