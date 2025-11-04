import nanomorph from "nanomorph";
import hh from "hyperscript-helpers";
import h from "hyperscript";
let current = null;
export const renderer = (root, vnode) => {
    if (!current) {
        root.appendChild(vnode);
        current = vnode;
    }
    else {
        current = nanomorph(current, vnode);
    }
};
export const { div, h1, h2, p, button, section, input, ul, li, span } = hh(h);
