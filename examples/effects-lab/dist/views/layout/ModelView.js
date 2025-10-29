import { h } from "effects-vdom";
export const ModelView = (m) => h("pre", { className: "w3-small w3-padding w3-light-grey" }, [
    JSON.stringify(m, null, 2),
]);
