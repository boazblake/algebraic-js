import m from "mithril"

const render = (root: Element, vnode: any) =>   m.render(root, vnode);


export type EffectLike = { run: () => any; cancel?: () => void };
export type Update<M, Msg> = (msg: Msg, model: M) => { model: M; effects?: EffectLike[] };
export type Program<M, Msg> = {
  init: { run: () => { model: M; effects?: EffectLike[] } };
  update: Update<M, Msg>;
  view: (model: M, dispatch: (m: Msg) => void) => any; // Mithril vnode
};

export const app = <M, Msg>(root: Element, prog: Program<M, Msg>) => {
  let model!: M;
  const queue: Msg[] = [];
  let queued = false;

  const runEffects = (fx?: EffectLike[]) => fx?.forEach((e) => e.run());

  const step = (msg: Msg) => {
    const { model: next, effects } = prog.update(msg, model);
    model = next;
    render(root, prog.view(model, dispatch));
    runEffects(effects);
  };

  const dispatch = (msg: Msg) => {
    queue.push(msg);
    if (!queued) {
      queued = true;
      requestAnimationFrame(() => {
        queued = false;
        while (queue.length) step(queue.shift()!);
      });
    }
  };

  const start = () => {
    const { model: m0, effects } = prog.init.run();
    model = m0;
    render(root, prog.view(model, dispatch));
    runEffects(effects);
  };
 (window as any).dispatch = dispatch;
  start();
  return { dispatch };
};
