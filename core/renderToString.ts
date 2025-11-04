import type { VNode, VChild } from "./types";

const escapeHtml = (s: any) =>
  String(s)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");

const renderProps = (props: Record<string, any> = {}) =>
  Object.entries(props)
    .filter(([k, v]) => !k.startsWith("on") && v != null && v !== false)
    .map(([k, v]) =>
      v === true ? ` ${k}` : ` ${k}="${escapeHtml(v)}"`
    )
    .join("");

const renderChild = (child: VChild): string => {
  if (child == null || child === false) return "";
  if (typeof child === "string" || typeof child === "number") return escapeHtml(child);
  return renderToString(child);
};

export const renderToString = (node: VChild): string => {
  if (node == null || node === false) return "";
  if (typeof node === "string" || typeof node === "number") return escapeHtml(node);

  const { tag, props = {}, children = [] } = node as VNode;
  const html = children.map(renderChild).join("");
  return `<${tag}${renderProps(props)}>${html}</${tag}>`;
};
