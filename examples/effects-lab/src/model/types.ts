import type { Writer } from "effects-vdom";

export type Env = { fetch: typeof fetch; baseUrl: string };

export type Post = { id: number; title: string; body: string };
export type Comment = { id: number; body: string };
export type Album = { id: number; title: string };
export type Photo = { id: number; thumbnailUrl: string };
export type Todo = { id: number; title: string; completed: boolean };
export type User = { id: number; name: string; email: string };

export type Resource<T> = {
  data: T[];
  loading: boolean;
  error?: string;
  page: number;
  limit: number;
  total?: number;
};

export type Model = {
  theme: "light" | "dark";
  env: Env;
  active: keyof EnvResources;
  logs: Writer<string[], string>;
} & EnvResources;

export type EnvResources = {
  posts: Resource<Post>;
  comments: Resource<Comment>;
  albums: Resource<Album>;
  photos: Resource<Photo>;
  todos: Resource<Todo>;
  users: Resource<User>;
};

export type Msg =
  | { type: "SET_ACTIVE"; key: keyof EnvResources }
  | { type: "FETCH_PAGE"; key: keyof EnvResources; page: number }
  | { type: "SET_PAGE"; key: keyof EnvResources; page: number }
  | { type: "FETCH_RESOURCE"; key: keyof EnvResources }
  | {
      type: "FETCH_SUCCESS";
      key: keyof EnvResources;
      data: any[];
      page: number;
    }
  | {
      type: "FETCH_ERROR";
      key: keyof EnvResources;
      error: string | { status: number; message: string };
    }
  | { type: "TOGGLE_THEME" };
