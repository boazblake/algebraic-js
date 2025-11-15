import { IO } from '../adt/io.js';
import { browserEnv } from '../core/dom.js';
export const renderApp = (renderer, env = browserEnv()) => (rootIO, program) => rootIO
    .map(root => {
    let model;
    const queue = [];
    let queued = false;
    // Executes both IO and Reader effects
    const runEffects = (fx) => {
        fx?.forEach(e => {
            if (!e)
                return;
            // plain IO
            if (typeof e.run === 'function' && !('map' in e)) {
                e.run();
                return;
            }
            // Reader<DomEnv, IO>  (our Reader-based sendMsg)
            if (typeof e.run === 'function' && 'map' in e) {
                const io = e.run(env); // supply the environment
                if (io && typeof io.run === 'function')
                    io.run();
                return;
            }
        });
    };
    const renderAndRunEffects = (m, effects) => {
        renderer(root, program.view(m, dispatch));
        runEffects(effects);
    };
    const step = (msg) => {
        const { model: next, effects } = program.update(msg, model, dispatch);
        model = next;
        renderAndRunEffects(model, effects || []);
    };
    const dispatch = (msg) => {
        queue.push(msg);
        if (!queued) {
            queued = true;
            requestAnimationFrame(() => {
                queued = false;
                const msgs = queue.splice(0, queue.length);
                for (const msg of msgs)
                    step(msg);
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
    .chain(io => io);
