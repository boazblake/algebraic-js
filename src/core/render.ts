import type { Program, EffectLike } from "./types.js";
import { IO } from "../adt/io.js";

export type Renderer = (root: Element, vnode: any) => void;

export const renderApp =
  (renderer: Renderer) =>
  <M, Msg>(
    rootIO: IO<Element>,
    program: Program<M, Msg>
  ): IO<{ dispatch: (msg: Msg) => void }> =>
    rootIO
      .map((root) => {
        let model!: M;
        const queue: Msg[] = [];
        let queued = false;

        //This is needs more work as currently it will only run ADTs with a run method that requires no args
        const runEffects = (fx?: EffectLike[]) => {
          return fx?.forEach((e) => {
            if (e.run && typeof e.run === "function") {
              e.run();
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
