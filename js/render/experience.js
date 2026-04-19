import { el, mount } from "../dom.js";
import { icon } from "../icon.js";

export function renderExperience(target, data) {
  const items = data.experience || [];
  const title = data.sectionOverrides?.experience?.title || "Experience";
  if (!items.length) return;

  const header = el("header", { class: "section__header container" }, [
    el("div", {}, [
      el("span", { class: "section__eyebrow" }, "Work"),
      el("h2", { class: "section__title", id: "experience-title" }, title),
    ]),
  ]);

  const timeline = el("ol", { class: "timeline container container--narrow" },
    items.map((xp, i) => el("li", {
      class: "timeline__item reveal",
      "data-current": i === 0 ? "true" : "false",
    }, [
      el("span", { class: "timeline__node", "aria-hidden": "true" }, [icon("briefcase", { size: "sm" })]),
      el("div", { class: "timeline__date" }, xp.duration),
      el("div", { class: "timeline__title" }, xp.position),
      el("div", { class: "timeline__description" }, [
        el("div", { class: "experience__company" }, [
          xp.company,
          xp.location && el("span", { class: "experience__location" }, ` · ${xp.location}`),
        ].filter(Boolean)),
        xp.description && el("p", { class: "experience__summary" }, xp.description),
        xp.achievements?.length && el("ul", { class: "experience__achievements" },
          xp.achievements.map(a => el("li", {}, [
            icon("check", { size: "sm", className: "icon--accent" }),
            el("span", {}, a),
          ]))
        ),
        xp.technologies?.length && el("div", { class: "cluster experience__tech" },
          xp.technologies.map(t => el("span", { class: "chip" }, t))
        ),
      ].filter(Boolean)),
    ]))
  );

  mount(target, [header, timeline]);
}
