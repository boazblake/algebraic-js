import { div, h1, button, p, ul, li, section, span } from "../renderer.js";
import type { Model, Msg, Resource, EnvResources } from "../../model/types.js";

const ResourceList = (
  key: keyof EnvResources,
  res: Resource<any>,
  dispatch: (msg: Msg) => void
) => {
  const { data, page, limit, loading, error } = res;
  const nextPage = page + 1;
  const prevPage = page - 1;
  const hasData = res.data.length || res.loading || res.error;

  return section({ className: "p-4 border rounded" }, [
    h1({ className: "text-lg font-bold mb-2 capitalize" }, key),
    button(
      {
        className: "bg-blue-600 text-white px-3 py-1 rounded mb-3",
        onclick: () => dispatch({ type: "FETCH_RESOURCE", key }),
      },
      res.loading ? "Loading..." : "Fetch"
    ),

    hasData &&
      div({ className: "flex items-center gap-3 mt-3" }, [
        button(
          {
            id: `${String(key)}-prev-${prevPage}`,
            className:
              "px-3 py-1 bg-gray-200 rounded disabled:opacity-50 disabled:cursor-not-allowed",
            disabled: res.page === 1 || res.loading,
            onclick: () =>
              dispatch({ type: "FETCH_PAGE", key, page: res.page - 1 }),
          },
          "Prev"
        ),
        span({ className: "text-sm" }, `Page ${res.page}`),
        button(
          {
            id: `${String(key)}-next-${nextPage}`,
            className: "px-3 py-1 bg-gray-200 rounded",
            onclick: () =>
              dispatch({ type: "FETCH_PAGE", key, page: res.page + 1 }),
          },
          "Next"
        ),
      ]),
    res.error &&
      p({ className: "text-red-600" }, `Error: ${JSON.stringify(res.error)}`),

    ul(
      { className: "text-sm space-y-1" },
      res.data.map((item: any) =>
        li({ className: "border-b pb-1" }, JSON.stringify(item))
      )
    ),
  ]);
};

export const ResourcePanel = (m: Model, dispatch: (msg: Msg) => void) =>
  div({ className: "grid grid-cols-2 gap-4" }, [
    ResourceList("posts", m.posts, dispatch),
    ResourceList("users", m.users, dispatch),
    ResourceList("comments", m.comments, dispatch),
    ResourceList("todos", m.todos, dispatch),
    ResourceList("albums", m.albums, dispatch),
    ResourceList("photos", m.photos, dispatch),
  ]);
