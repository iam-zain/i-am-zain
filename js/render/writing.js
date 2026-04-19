import { el, mount } from "../dom.js";
import { icon } from "../icon.js";
import { isExternal } from "../utils/paths.js";
import { formatDate, dateSortKey, formatYear } from "../utils/format.js";

export function renderWriting(target, data) {
  const items = [...(data.writing || [])].sort((a, b) => dateSortKey(b.date) - dateSortKey(a.date));
  const title = data.sectionOverrides?.writing?.title || "Writing & Notes";
  if (!items.length) return;

  const header = el("header", { class: "section__header container" }, [
    el("div", {}, [
      el("span", { class: "section__eyebrow" }, "Notes"),
      el("h2", { class: "section__title", id: "writing-title" }, title),
      el("p", { class: "section__subtitle" }, "Short-form writing — research notes, methodology reflections, and open problems."),
    ]),
  ]);

  const byYear = groupByYear(items);

  const groups = el("div", { class: "container container--narrow writing__groups" },
    byYear.map(([year, entries]) =>
      el("section", { class: "writing__group" }, [
        el("h3", { class: "writing__year text-mono" }, year),
        el("ul", { class: "writing__list" },
          entries.map(w => writingRow(w))
        ),
      ])
    )
  );

  mount(target, [header, groups]);
}

function writingRow(w) {
  const external = isExternal(w.url);
  const row = el("li", { class: "writing__row reveal" }, [
    el("a", {
      class: "writing__link",
      href: w.url || "#",
      target: external ? "_blank" : null,
      rel: external ? "noopener noreferrer" : null,
    }, [
      el("div", { class: "writing__row-main" }, [
        el("h4", { class: "writing__title" }, w.title),
        w.excerpt && el("p", { class: "writing__excerpt" }, w.excerpt),
        w.tags?.length && el("div", { class: "cluster writing__tags" },
          w.tags.map(t => el("span", { class: "chip" }, [icon("hash", { size: "sm", className: "icon--muted" }), t]))
        ),
      ].filter(Boolean)),
      el("div", { class: "writing__row-meta" }, [
        el("span", { class: "writing__date text-mono" }, formatDate(w.date)),
        icon(external ? "arrow-up-right" : "arrow-right", { size: "md", className: "writing__arrow" }),
      ]),
    ]),
  ]);
  return row;
}

function groupByYear(items) {
  const map = new Map();
  for (const w of items) {
    const year = formatYear(w.date) || "Undated";
    if (!map.has(year)) map.set(year, []);
    map.get(year).push(w);
  }
  return [...map.entries()].sort((a, b) => b[0].localeCompare(a[0]));
}
