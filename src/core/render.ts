import type { Program, EffectLike } from "./types.js";
import { IO } from "../adt/io.js";
import { browserEnv,type NetEnv } from "../core/dom.js";

export type Renderer = (root: Element, vnode: any) => void;

/**
 * renderApp
 * Executes both IO and Reader<NetEnv, IO> effects.
 * The `env` includes the DOM environment and, when provided,
 * a WebSocket or anything else you add to NetEnv.
 */
export const renderApp =
  (renderer: Renderer, env: NetEnv = browserEnv() as NetEnv) =>
  <M, Msg>(
    rootIO: IO<Element>,
    program: Program<M, Msg>
  ): IO<{ dispatch: (msg: Msg) => void; getModel: () => M }> =>
    rootIO
      .map((root) => {
        let model!: M;
        const queue: Msg[] = [];
        let queued = false;

        /** Executes IO and Reader<NetEnv, IO> effects */
        const runEffects = (fx?: any[]) => {
          fx?.forEach((e) => {
            // Plain IO
            if (e && typeof e.run === "function" && !("map" in e)) {
              e.run();
            }
            // Reader<NetEnv, IO>
            else if (e && typeof e.run === "function" && "map" in e) {
              const io = e.run(env);
              if (io && typeof io.run === "function") io.run();
            }
          });
        };

        const renderAndRunEffects = (m: M, effects: EffectLike[]) => {
          renderer(root, program.view(m, dispatch));
          runEffects(effects);
        };

        const step = (msg: Msg) => {
          const { model: next, effects } = program.update(msg, model, dispatch);
          model = next;
          renderAndRunEffects(model, effects || []);
        };

        const dispatch = (msg: Msg) => {
          queue.push(msg);
          if (!queued) {
            queued = true;
            requestAnimationFrame(() => {
              queued = false;
              const msgs = queue.splice(0, queue.length);
              for (const msg of msgs) step(msg);
            });
          }
        };

        const start = () => {
          const { model: m0, effects } = program.init.run();
          model = m0;
          renderAndRunEffects(model, effects || []);
        };

        return IO(() => {
          start();
          return { dispatch, getModel: () => model };
        });
      })
      .chain((io) => io);
