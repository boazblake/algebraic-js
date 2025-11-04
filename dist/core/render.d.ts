import type { Program } from "./types.js";
import { IO } from "../adt/io.js";
export type Renderer = (root: Element, vnode: any) => void;
export declare const renderApp: (renderer: Renderer) => <M, Msg>(rootIO: IO<Element>, program: Program<M, Msg>) => IO<{
    dispatch: (msg: Msg) => void;
}>;
