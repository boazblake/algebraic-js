type Primitive = string | number | boolean | null | undefined;

const escapeHtml = (s: string) =>
  s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");

const isVNode = (
  n: unknown
): n is { tag: string; props?: any; children?: any } =>
  !!n && typeof n === "object" && "tag" in (n as any);

const VOID = new Set([
  "area",
  "base",
  "br",
  "col",
  "embed",
  "hr",
  "img",
  "input",
  "link",
  "meta",
  "param",
  "source",
  "track",
  "wbr",
]);

export const renderToString = (node: unknown): string => {
  if (node == null || node === false || node === true) return "";
  if (typeof node === "string" || typeof node === "number") return String(node);
  if (Array.isArray(node)) return node.map(renderToString).join("");
  if (!isVNode(node)) return "";

  const { tag, props = {}, children = [] } = node;

  const attrs = Object.entries(props)
    .filter(([, v]) => v != null && v !== false && typeof v !== "function")
    .map(([k, v]) => (v === true ? k : `${k}="${escapeHtml(String(v))}"`))
    .join(" ");

  const open = attrs ? `<${tag} ${attrs}>` : `<${tag}>`;
  if (VOID.has(tag)) return open;

  const kids = Array.isArray(children) ? children : [children as Primitive];
  const inner = kids.map(renderToString).join("");

  return `${open}${inner}</${tag}>`;
};
