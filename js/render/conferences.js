import { el, mount, qsa } from "../dom.js";
import { icon } from "../icon.js";
import { asset } from "../utils/paths.js";
import { formatDate } from "../utils/format.js";
import { carousel } from "../components/carousel.js";

export function renderConferences(target, data) {
  const conferences = data.conferences || [];
  const workshops = data.workshops || [];
  const title = data.sectionOverrides?.conferences?.title || "Talks & Posters";
  if (!conferences.length && !workshops.length) return;

  const header = el("header", { class: "section__header container" }, [
    el("div", {}, [
      el("span", { class: "section__eyebrow" }, "Presented At"),
      el("h2", { class: "section__title", id: "conferences-title" }, title),
      el("p", { class: "section__subtitle" }, "Research presentations and workshop participation across international venues."),
    ]),
  ]);

  const blocks = el("div", { class: "conferences__blocks container" }, [
    conferences.length && el("div", { class: "conferences__group" }, [
      el("h3", { class: "conferences__group-title" }, [icon("mic", { size: "md", className: "icon--accent" }), "Conferences"]),
      buildCarousel(conferences, "conferences"),
    ]),
    workshops.length && el("div", { class: "conferences__group" }, [
      el("h3", { class: "conferences__group-title" }, [icon("users", { size: "md", className: "icon--accent" }), "Workshops"]),
      buildCarousel(workshops, "workshops"),
    ]),
  ].filter(Boolean));

  mount(target, [header, blocks]);

  qsa(".carousel", target).forEach(carousel);
}

function buildCarousel(items, kind) {
  return el("div", { class: "carousel", role: "region", "aria-label": kind }, [
    el("div", { class: "carousel__viewport" },
      items.map(item => el("article", { class: "carousel__item" }, [eventCard(item)]))
    ),
  ]);
}

function eventCard(item) {
  const typeLabel = item.presentationType
    ? item.presentationType[0].toUpperCase() + item.presentationType.slice(1)
    : item.mode || "";

  return el("div", { class: "card reveal" }, [
    item.image?.src && el("div", { class: "card__media" }, [
      el("img", {
        src: asset(item.image.src),
        alt: item.image.alt,
        width: item.image.width || 1200,
        height: item.image.height || 800,
        loading: "lazy",
        decoding: "async",
      }),
    ]),

    el("div", { class: "card__eyebrow" }, [
      typeLabel && el("span", { class: "badge badge--accent" }, typeLabel),
      item.date && el("span", { class: "text-mono" }, formatDate(item.date)),
    ].filter(Boolean)),

    el("h4", { class: "card__title" }, item.title),

    item.location && el("div", { class: "card__meta" }, [
      el("span", { class: "card__meta-item" }, [icon("map-pin", { size: "sm", className: "icon--muted" }), item.location]),
    ]),

    item.description && el("p", { class: "card__body" }, item.description),
  ].filter(Boolean));
}
