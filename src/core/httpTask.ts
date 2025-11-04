import { Reader, Task, Either } from "../adt/index.js";

export type HttpEnv = {
  fetch: typeof fetch;
  baseUrl?: string;
};

export type HttpError =
  | { status: number; message: string }
  | { message: string };

/**
 * HTTP Reader–Task abstraction using Either for errors.
 */
export const httpTask = <A>(
  path: string,
  options?: RequestInit
): Reader<HttpEnv, Task<HttpError, A>> =>
  Reader((env) =>
    Task<HttpError, A>(async () => {
      try {
        const r = await env.fetch(`${env.baseUrl ?? ""}${path}`, options);

        if (!r.ok) {
          return Either.Left<HttpError>({
            status: r.status,
            message: r.statusText || "HTTP error",
          });
        }

        const data = (await r.json()) as A;
        return Either.Right<A>(data);
      } catch (e: any) {
        return Either.Left<HttpError>({
          message: e instanceof Error ? e.message : String(e),
        });
      }
    })
  );

/**
 * Example:
 *
 * const getUsers = httpTask<User[]>("/users");
 * const task = getUsers.run({ fetch, baseUrl: "https://jsonplaceholder.typicode.com" });
 * const result = await task.run();
 */
