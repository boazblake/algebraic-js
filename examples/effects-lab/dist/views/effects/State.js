import { h, State } from "effects-vdom";
export const StateEffect = (_, __) => {
    const counter = State((s) => [s, s + 1]);
    const doubled = counter.map((x) => x * 2);
    const chained = counter.chain((x) => State((s) => [x + s, s + 2]));
    const [val1, s1] = counter.run(0);
    const [val2, s2] = doubled.run(1);
    const [val3, s3] = chained.run(2);
    return h("div", { className: "w3-container" }, [
        h("h3", {}, "State (mutable computation in pure form)"),
        h("ul", {}, [
            h("li", {}, `run(0): value=${val1}, state=${s1}`),
            h("li", {}, `map(*2): value=${val2}, state=${s2}`),
            h("li", {}, `chain(+s): value=${val3}, state=${s3}`),
        ]),
    ]);
};
