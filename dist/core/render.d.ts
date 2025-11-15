import type { Program } from './types.js';
import { IO } from '../adt/io.js';
import type { DomEnv } from '../core/dom.js';
export type Renderer = (root: Element, vnode: any) => void;
export declare const renderApp: (renderer: Renderer, env?: DomEnv) => <M, Msg>(rootIO: IO<Element>, program: Program<M, Msg>) => IO<{
    dispatch: (msg: Msg) => void;
    getModel: () => M;
}>;
