import { el, mount } from "../dom.js";
import { icon, iconForKind } from "../icon.js";
import { asset, isExternal } from "../utils/paths.js";

const STATUS_LABEL = {
  active:      "Active",
  "in-progress": "Active",
  completed:   "Completed",
  archived:    "Archived",
  draft:       "Draft",
};

const STATUS_BADGE = {
  active:      "badge badge--success badge--pulse",
  "in-progress": "badge badge--success badge--pulse",
  completed:   "badge",
  archived:    "badge",
  draft:       "badge badge--warning",
};

export function renderProjects(target, data) {
  const items = data.projects || [];
  const title = data.sectionOverrides?.projects?.title || "Projects";
  if (!items.length) return;

  const header = el("header", { class: "section__header container" }, [
    el("div", {}, [
      el("span", { class: "section__eyebrow" }, "Work"),
      el("h2", { class: "section__title", id: "projects-title" }, title),
      el("p", { class: "section__subtitle" }, "Selected research and applied work. Each project pairs computational method with a clinical or biological question."),
    ]),
  ]);

  const grid = el("div", { class: "container grid grid--cols-3 projects__grid" },
    items.map(p => projectCard(p))
  );

  mount(target, [header, grid]);
}

function projectCard(p) {
  return el("article", { class: "card reveal" }, [
    p.image?.src && el("div", { class: "card__media" }, [
      el("img", {
        src: asset(p.image.src),
        alt: p.image.alt,
        width: p.image.width || 1200,
        height: p.image.height || 800,
        loading: "lazy",
        decoding: "async",
      }),
    ]),

    el("div", { class: "card__eyebrow" }, [
      p.status && el("span", { class: STATUS_BADGE[p.status] || "badge" }, STATUS_LABEL[p.status] || p.status),
      p.year && el("span", { class: "text-mono" }, p.year),
    ].filter(Boolean)),

    el("h3", { class: "card__title" }, p.title),
    p.subtitle && el("p", { class: "card__subtitle" }, p.subtitle),
    p.description && el("p", { class: "card__body" }, p.description),

    p.technologies?.length && el("div", { class: "cluster" },
      p.technologies.map(t => el("span", { class: "chip" }, t))
    ),

    p.links?.length && el("div", { class: "card__footer" },
      p.links.map(l => el("a", {
        class: "btn btn--sm btn--ghost",
        href: l.url,
        target: isExternal(l.url) ? "_blank" : null,
        rel: isExternal(l.url) ? "noopener noreferrer" : null,
      }, [
        icon(iconForKind(l.kind), { size: "sm", label: null }),
        l.label,
        isExternal(l.url) && icon("arrow-up-right", { size: "sm", label: null }),
      ].filter(Boolean)))
    ),
  ].filter(Boolean));
}
