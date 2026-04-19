import { qsa } from "../dom.js";

/**
 * Adds .is-visible to any element with .reveal once it enters the viewport.
 * Honors prefers-reduced-motion by immediately marking all elements visible.
 */
export function initReveal() {
  const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const targets = qsa(".reveal");
  if (!targets.length) return;

  if (reduce || !("IntersectionObserver" in window)) {
    targets.forEach(t => t.classList.add("is-visible"));
    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    },
    { rootMargin: "0px 0px -10% 0px", threshold: 0.15 }
  );

  targets.forEach(t => observer.observe(t));
}
