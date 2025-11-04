import { Reader, Task, Either } from "../adt/index.js";
/**
 * HTTP Reader–Task abstraction using Either for errors.
 */
export const httpTask = (path, options) => Reader((env) => Task(async () => {
    try {
        const r = await env.fetch(`${env.baseUrl ?? ""}${path}`, options);
        if (!r.ok) {
            return Either.Left({
                status: r.status,
                message: r.statusText || "HTTP error",
            });
        }
        const data = (await r.json());
        return Either.Right(data);
    }
    catch (e) {
        return Either.Left({
            message: e instanceof Error ? e.message : String(e),
        });
    }
}));
/**
 * Example:
 *
 * const getUsers = httpTask<User[]>("/users");
 * const task = getUsers.run({ fetch, baseUrl: "https://jsonplaceholder.typicode.com" });
 * const result = await task.run();
 */
