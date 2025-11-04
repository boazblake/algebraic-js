import type { Program, EffectLike } from "./types.js";
import { IO } from "../adt/io.js";

export type Renderer = (root: Element, vnode: any) => void;

export const renderApp =
  (renderer: Renderer) =>
  <M, Msg>(rootIO: IO<Element>, program: Program<M, Msg>): IO<{ dispatch: (msg: Msg) => void }> =>
    rootIO.map((root) => {
      let model!: M;
      const queue: Msg[] = [];
      let queued = false;

      const runEffects = (fx?: EffectLike[]) => fx?.forEach((e) => e.run());

      const step = (msg: Msg) => {
        const { model: next, effects } = program.update(msg, model, dispatch);
        model = next;
        renderer(root, program.view(model, dispatch));
        runEffects(effects);
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
        renderer(root, program.view(model, dispatch));
        runEffects(effects);
      };

      return IO(() => {
        start();
        return { dispatch };
      });
    }).chain((io) => io);
