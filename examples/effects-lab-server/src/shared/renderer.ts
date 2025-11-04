import nanomorph from "nanomorph";
import hh from "hyperscript-helpers";
import * as hyperscript from "hyperscript";

const h: any = (hyperscript as any).default || hyperscript;

let current: Element | null = null;

export const renderer = (root: Element, vnode: Element) => {
  if (!current) {
    root.appendChild(vnode);
    current = vnode;
  } else {
    current = nanomorph(current, vnode);
  }
};

export const { div, h1, h2, p, button, section, input, ul, li, span } = hh(h);
