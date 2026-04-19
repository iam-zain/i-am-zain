import { el, qsa } from "../dom.js";
import { icon } from "../icon.js";

/**
 * Turn a {.carousel > .carousel__viewport > .carousel__item*} structure into
 * a keyboard + arrow-button controlled scroller with dots.
 *
 * Call: carousel(containerEl)
 */
export function carousel(container) {
  const viewport = container.querySelector(".carousel__viewport");
  if (!viewport) return;
  const items = qsa(".carousel__item", viewport);
  if (items.length <= 1) return;

  const controls = el("div", { class: "carousel__controls" });
  const dots = el("div", { class: "carousel__dots", role: "tablist", "aria-label": "Carousel pages" });

  const prev = el("button", {
    type: "button",
    class: "btn btn--icon btn--ghost",
    "aria-label": "Previous",
    onclick: () => scrollBy(-1),
  }, [icon("chevron-left", { size: "md", label: null })]);

  const next = el("button", {
    type: "button",
    class: "btn btn--icon btn--ghost",
    "aria-label": "Next",
    onclick: () => scrollBy(1),
  }, [icon("chevron-right", { size: "md", label: null })]);

  const dotButtons = items.map((_, i) =>
    el("button", {
      type: "button",
      class: "carousel__dot",
      role: "tab",
      "aria-label": `Go to item ${i + 1}`,
      "aria-current": i === 0 ? "true" : "false",
      onclick: () => scrollTo(i),
    })
  );
  dotButtons.forEach(b => dots.append(b));

  controls.append(dots, prev, next);
  container.append(controls);

  viewport.addEventListener("scroll", () => {
    const index = indexOfClosestItem();
    dotButtons.forEach((d, i) => d.setAttribute("aria-current", String(i === index)));
  }, { passive: true });

  viewport.setAttribute("tabindex", "0");
  viewport.addEventListener("keydown", (e) => {
    if (e.key === "ArrowLeft")  { e.preventDefault(); scrollBy(-1); }
    if (e.key === "ArrowRight") { e.preventDefault(); scrollBy(1); }
    if (e.key === "Home")       { e.preventDefault(); scrollTo(0); }
    if (e.key === "End")        { e.preventDefault(); scrollTo(items.length - 1); }
  });

  function indexOfClosestItem() {
    const left = viewport.scrollLeft;
    let best = 0;
    let bestDist = Infinity;
    items.forEach((it, i) => {
      const dist = Math.abs(it.offsetLeft - left);
      if (dist < bestDist) { bestDist = dist; best = i; }
    });
    return best;
  }

  function scrollTo(i) {
    const clamped = Math.max(0, Math.min(items.length - 1, i));
    viewport.scrollTo({ left: items[clamped].offsetLeft, behavior: "smooth" });
  }

  function scrollBy(delta) {
    scrollTo(indexOfClosestItem() + delta);
  }
}

/** Apply carousel behavior to every .carousel in a container. */
export function initCarousels(root = document) {
  qsa(".carousel", root).forEach(carousel);
}
