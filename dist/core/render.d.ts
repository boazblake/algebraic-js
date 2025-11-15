import type { Program } from "./types.js";
import { IO } from "../adt/io.js";
import { type NetEnv } from "../core/dom.js";
export type Renderer = (root: Element, vnode: any) => void;
/**
 * renderApp
 * Executes both IO and Reader<NetEnv, IO> effects.
 * The `env` includes the DOM environment and, when provided,
 * a WebSocket or anything else you add to NetEnv.
 */
export declare const renderApp: (renderer: Renderer, env?: NetEnv) => <M, Msg>(rootIO: IO<Element>, program: Program<M, Msg>) => IO<{
    dispatch: (msg: Msg) => void;
    getModel: () => M;
}>;
