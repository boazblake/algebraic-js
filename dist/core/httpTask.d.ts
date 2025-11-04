import { Reader, Task } from "../adt/index.js";
export type HttpEnv = {
    fetch: typeof fetch;
    baseUrl?: string;
};
export type HttpError = {
    status: number;
    message: string;
} | {
    message: string;
};
/**
 * HTTP Reader–Task abstraction using Either for errors.
 */
export declare const httpTask: <A>(path: string, options?: RequestInit) => Reader<HttpEnv, Task<HttpError, A>>;
/**
 * Example:
 *
 * const getUsers = httpTask<User[]>("/users");
 * const task = getUsers.run({ fetch, baseUrl: "https://jsonplaceholder.typicode.com" });
 * const result = await task.run();
 */
