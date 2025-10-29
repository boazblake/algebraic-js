import m from "mithril";
const render = (root, vnode) => m.render(root, vnode);
export const app = (root, prog) => {
    let model;
    const queue = [];
    let queued = false;
    const runEffects = (fx) => fx?.forEach((e) => e.run());
    const step = (msg) => {
        const { model: next, effects } = prog.update(msg, model);
        model = next;
        render(root, prog.view(model, dispatch));
        runEffects(effects);
    };
    const dispatch = (msg) => {
        queue.push(msg);
        if (!queued) {
            queued = true;
            requestAnimationFrame(() => {
                queued = false;
                while (queue.length)
                    step(queue.shift());
            });
        }
    };
    const start = () => {
        const { model: m0, effects } = prog.init.run();
        model = m0;
        render(root, prog.view(model, dispatch));
        runEffects(effects);
    };
    window.dispatch = dispatch;
    start();
    return { dispatch };
};
