const SVG_NS = "http://www.w3.org/2000/svg";

/**
 * Returns an inline <svg><use/></svg> that references the shared sprite.
 * `aria-hidden` by default; decorative unless caller provides `aria-label`.
 *
 *   icon("mail")
 *   icon("github", { size: "lg" })
 *   icon("menu",   { label: "Open menu" })
 *
 * NOTE: Both <svg> and <use> MUST be created via createElementNS. Using
 * document.createElement("svg") silently produces an HTMLUnknownElement that
 * does not render any SVG geometry, even though attributes look correct in
 * DevTools. Don't route this through dom.el().
 */
export function icon(name, { size = "md", label, className } = {}) {
  const svg = document.createElementNS(SVG_NS, "svg");
  const classes = ["icon", `icon--${size}`, className].filter(Boolean).join(" ");
  svg.setAttribute("class", classes);
  svg.setAttribute("viewBox", "0 0 24 24");
  svg.setAttribute("focusable", "false");
  if (label) {
    svg.setAttribute("role", "img");
    svg.setAttribute("aria-label", label);
  } else {
    svg.setAttribute("aria-hidden", "true");
  }

  const use = document.createElementNS(SVG_NS, "use");
  use.setAttribute("href", `/icons/sprite.svg#${name}`);
  svg.appendChild(use);
  return svg;
}

export const ICON_FOR_LINK_KIND = {
  github:       "github",
  linkedin:     "linkedin",
  twitter:      "twitter",
  x:            "twitter",
  researchgate: "microscope",
  orcid:        "book-open",
  scholar:      "graduation-cap",
  email:        "mail",
  phone:        "phone",
  website:      "globe",
  external:     "external-link",
  demo:         "external-link",
  paper:        "file-text",
  pdf:          "file-text",
  code:         "github",
};

export function iconForKind(kind) {
  return ICON_FOR_LINK_KIND[kind] || "external-link";
}
