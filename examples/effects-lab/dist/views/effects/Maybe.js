import { h, Just, Nothing } from "effects-vdom";
export const MaybeEffect = (_, __) => {
    const safeDivide = (a, b) => b === 0 ? Nothing : Just(a / b);
    const result1 = safeDivide(6, 2);
    const result2 = safeDivide(6, 0);
    return h("div", { className: "w3-container" }, [
        h("h3", {}, "Maybe (Optional)"),
        h("p", {}, "Models optional values without null/undefined."),
        h("ul", {}, [
            h("li", {}, `6 / 2 = ${result1._tag === "Just" ? result1.value : "Nothing"}`),
            h("li", {}, `6 / 0 = ${result2._tag === "Just" ? result2.value : "Nothing"}`),
        ]),
    ]);
};
