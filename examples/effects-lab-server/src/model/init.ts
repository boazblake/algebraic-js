import { IO, Writer } from "../../node_modules/effects-vdom/dist/adt/index.js";
import type { Model } from "./types.js";

export const init = IO(() => {
  const isBrowser = typeof window !== "undefined";

  const env = isBrowser
    ? {
        fetch: window.fetch.bind(window),
        baseUrl: "https://jsonplaceholder.typicode.com",
      }
    : {
        fetch: globalThis.fetch,
        baseUrl: "https://jsonplaceholder.typicode.com",
      };
  const empty = { data: [], loading: false, page: 1, limit: 10 };

  const model: Model = {
    theme: "light",
    env,
    active: "posts",
    logs: Writer.of("", []),
    posts: empty,
    users: empty,
    comments: empty,
    albums: empty,
    photos: empty,
    todos: empty,
  };

  return { model, effects: [] };
});
