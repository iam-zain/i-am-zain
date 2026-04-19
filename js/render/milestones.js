import { el, mount } from "../dom.js";
import { icon } from "../icon.js";
import { formatDate, dateSortKey } from "../utils/format.js";

const KIND_LABELS = {
  education:   "Education",
  research:    "Research",
  growth:      "Growth",
  recognition: "Recognition",
};

export function renderMilestones(target, data) {
  const milestones = [...(data.milestones || [])]
    .sort((a, b) => dateSortKey(a.date) - dateSortKey(b.date));
  const title = data.sectionOverrides?.milestones?.title || "Journey";

  if (!milestones.length) return;

  const header = el("header", { class: "section__header container" }, [
    el("div", {}, [
      el("span", { class: "section__eyebrow" }, "Milestones"),
      el("h2", { class: "section__title", id: "milestones-title" }, title),
      el("p", { class: "section__subtitle" }, "Key moments in my research journey — education, first publications, and growth-defining experiences."),
    ]),
  ]);

  const timeline = el("ol", { class: "timeline timeline--gradient container container--narrow" },
    milestones.map(m =>
      el("li", { class: "timeline__item reveal", "data-kind": m.kind }, [
        el("span", { class: "timeline__node", "aria-hidden": "true" }, [icon(m.icon || "circle-dot", { size: "sm" })]),
        el("div", { class: "timeline__date" }, formatDate(m.date, { long: true })),
        el("div", { class: "timeline__title" }, m.title),
        m.description && el("div", { class: "timeline__description" }, m.description),
        m.kind && el("div", { class: "timeline__meta" }, [
          el("span", { class: kindBadgeClass(m.kind) }, KIND_LABELS[m.kind] || m.kind),
        ]),
      ].filter(Boolean))
    )
  );

  mount(target, [header, timeline]);
}

function kindBadgeClass(kind) {
  const map = {
    education:   "badge badge--info",
    research:    "badge badge--accent",
    growth:      "badge badge--success",
    recognition: "badge badge--warning",
  };
  return map[kind] || "badge";
}
