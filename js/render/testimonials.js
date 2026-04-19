import { el, mount } from "../dom.js";
import { icon } from "../icon.js";
import { asset } from "../utils/paths.js";

export function renderTestimonials(target, data) {
  const items = data.testimonials || [];
  const title = data.sectionOverrides?.testimonials?.title || "Recommendations";
  if (!items.length) return;

  const header = el("header", { class: "section__header container" }, [
    el("div", {}, [
      el("span", { class: "section__eyebrow" }, "Kind Words"),
      el("h2", { class: "section__title", id: "testimonials-title" }, title),
    ]),
  ]);

  const grid = el("div", { class: "container grid grid--cols-2 testimonials__grid" },
    items.map(t => el("figure", { class: "card testimonial reveal" }, [
      el("div", { class: "testimonial__quote" }, [
        icon("quote", { size: "lg", className: "icon--accent testimonial__quote-mark" }),
        el("blockquote", {}, t.quote),
      ]),
      el("figcaption", { class: "testimonial__author" }, [
        t.avatar?.src && el("img", {
          class: "testimonial__avatar",
          src: asset(t.avatar.src),
          alt: t.avatar.alt,
          width: t.avatar.width || 80,
          height: t.avatar.height || 80,
          loading: "lazy",
          decoding: "async",
        }),
        el("div", {}, [
          el("div", { class: "testimonial__name" }, t.author),
          t.role && el("div", { class: "testimonial__role" }, [t.role, t.affiliation && ` · ${t.affiliation}`].filter(Boolean)),
          t.relationship && el("div", { class: "testimonial__relationship" }, t.relationship),
        ].filter(Boolean)),
      ].filter(Boolean)),
    ]))
  );

  mount(target, [header, grid]);
}
