/**
 * Tiny DOM helpers — replace innerHTML string soup.
 * el("div", { class: "foo", onclick: fn }, [child1, child2, "text"])
 */
export function el(tag, attrs = {}, children = []) {
  const node = document.createElement(tag);
  for (const [key, value] of Object.entries(attrs)) {
    if (value == null || value === false) continue;
    if (key === "class" || key === "className") {
      node.className = Array.isArray(value) ? value.filter(Boolean).join(" ") : value;
    } else if (key === "style" && typeof value === "object") {
      Object.assign(node.style, value);
    } else if (key === "dataset" && typeof value === "object") {
      for (const [dk, dv] of Object.entries(value)) node.dataset[dk] = dv;
    } else if (key.startsWith("on") && typeof value === "function") {
      node.addEventListener(key.slice(2).toLowerCase(), value);
    } else if (key === "html") {
      node.innerHTML = value;
    } else if (value === true) {
      node.setAttribute(key, "");
    } else {
      node.setAttribute(key, value);
    }
  }
  for (const child of [].concat(children)) {
    if (child == null || child === false) continue;
    if (child instanceof Node) node.append(child);
    else node.append(document.createTextNode(String(child)));
  }
  return node;
}

export function frag(...children) {
  const f = document.createDocumentFragment();
  for (const c of children) {
    if (c == null || c === false) continue;
    f.append(c instanceof Node ? c : document.createTextNode(String(c)));
  }
  return f;
}

export function mount(selector, content) {
  const target = typeof selector === "string" ? document.querySelector(selector) : selector;
  if (!target) return;
  target.replaceChildren(content instanceof Node ? content : frag(...[].concat(content)));
}

export function clearChildren(node) {
  while (node.firstChild) node.firstChild.remove();
}

export function qs(sel, root = document)  { return root.querySelector(sel); }
export function qsa(sel, root = document) { return [...root.querySelectorAll(sel)]; }
