import { el, mount } from "../dom.js";
import { icon } from "../icon.js";

const SKILL_GROUPS = [
  { key: "programming", title: "Languages",  icon: "code" },
  { key: "backend",     title: "ML & Methods", icon: "brain" },
  { key: "tools",       title: "Tooling",     icon: "flask-conical" },
  { key: "concepts",    title: "Frameworks",  icon: "atom" },
];

export function renderAbout(target, data) {
  const { summary, education, skills, sectionOverrides } = data;
  const title = sectionOverrides?.about?.title || "About";

  const header = el("header", { class: "section__header container" }, [
    el("div", {}, [
      el("span", { class: "section__eyebrow" }, "Profile"),
      el("h2", { class: "section__title", id: "about-title" }, title),
    ]),
  ]);

  const summaryBlock = el("div", { class: "about__summary container" }, [
    el("p", { class: "about__bio reveal" }, summary),
  ]);

  const educationList = education?.length
    ? el("div", { class: "about__column about__column--education reveal" }, [
        el("h3", { class: "about__heading" }, [icon("graduation-cap", { size: "md", className: "icon--accent" }), "Education"]),
        el("ul", { class: "about__list" }, education.map(e =>
          el("li", { class: "about__item" }, [
            el("div", { class: "about__item-title" }, e.degree),
            el("div", { class: "about__item-meta" }, [e.institution, e.graduationYear].filter(Boolean).join(" · ")),
            e.gpa && el("div", { class: "about__item-extra" }, e.gpa),
          ].filter(Boolean))
        )),
      ])
    : null;

  const skillsBlock = el("div", { class: "about__column about__column--skills reveal" }, [
    el("h3", { class: "about__heading" }, [icon("sparkles", { size: "md", className: "icon--accent" }), "Skills"]),
    ...SKILL_GROUPS.map(group => {
      const items = skills?.technical?.[group.key] || [];
      if (!items.length) return null;
      return el("div", { class: "about__skill-group" }, [
        el("div", { class: "about__skill-title" }, [icon(group.icon, { size: "sm", className: "icon--muted" }), group.title]),
        el("div", { class: "cluster" }, items.map(s => el("span", { class: "chip" }, s))),
      ]);
    }).filter(Boolean),
    skills?.soft?.length && el("div", { class: "about__skill-group" }, [
      el("div", { class: "about__skill-title" }, [icon("users", { size: "sm", className: "icon--muted" }), "Soft Skills"]),
      el("div", { class: "cluster" }, skills.soft.map(s => el("span", { class: "chip" }, s))),
    ]),
  ].filter(Boolean));

  const columns = el("div", { class: "about__columns container" }, [educationList, skillsBlock].filter(Boolean));

  mount(target, [header, summaryBlock, columns]);
}
