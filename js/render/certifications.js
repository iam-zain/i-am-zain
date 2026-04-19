import { el, mount } from "../dom.js";
import { icon } from "../icon.js";

export function renderCertifications(target, data) {
  const items = data.certifications || [];
  const title = data.sectionOverrides?.certifications?.title || "Certifications";
  if (!items.length) return;

  const header = el("header", { class: "section__header container" }, [
    el("div", {}, [
      el("span", { class: "section__eyebrow" }, "Training"),
      el("h2", { class: "section__title", id: "certifications-title" }, title),
      el("p", { class: "section__subtitle" }, "Workshops, internships, and certification programs completed."),
    ]),
  ]);

  // Group by year descending
  const byYear = new Map();
  for (const c of items) {
    const year = String(c.year || "Undated");
    if (!byYear.has(year)) byYear.set(year, []);
    byYear.get(year).push(c);
  }
  const years = [...byYear.entries()].sort((a, b) => b[0].localeCompare(a[0]));

  const groups = el("div", { class: "container container--narrow certifications__groups" },
    years.map(([year, list]) =>
      el("section", { class: "certifications__group" }, [
        el("h3", { class: "certifications__year text-mono" }, year),
        el("ul", { class: "certifications__list" },
          list.map(c =>
            el("li", { class: "certifications__item reveal" }, [
              el("span", { class: "certifications__icon", "aria-hidden": "true" },
                [icon(iconForType(c.type), { size: "sm" })]
              ),
              el("div", { class: "certifications__body" }, [
                el("div", { class: "certifications__title" }, c.title),
                el("div", { class: "cluster certifications__meta" }, [
                  c.type && el("span", { class: "badge" }, c.type),
                  c.issuer && el("span", { class: "certifications__issuer" }, c.issuer),
                ].filter(Boolean)),
              ]),
            ])
          )
        ),
      ])
    )
  );

  mount(target, [header, groups]);
}

function iconForType(type = "") {
  const t = type.toLowerCase();
  if (t.includes("intern")) return "briefcase";
  if (t.includes("course")) return "graduation-cap";
  return "award";
}
