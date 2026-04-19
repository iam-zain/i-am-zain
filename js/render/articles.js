import { el, mount, qsa } from "../dom.js";
import { icon } from "../icon.js";
import { asset, isExternal } from "../utils/paths.js";
import { formatDate } from "../utils/format.js";
import { carousel } from "../components/carousel.js";

const GROUP_ORDER = ["research", "review", "bookChapter", "abstract"];

const GROUP_META = {
  research:    { title: "Research Articles", icon: "microscope", badge: "badge--info",    label: "Research" },
  review:      { title: "Reviews",           icon: "book-open",  badge: "badge--accent",  label: "Review" },
  bookChapter: { title: "Book Chapters",     icon: "file-text",  badge: "badge--info",    label: "Chapter" },
  abstract:    { title: "Abstracts",         icon: "pen-line",   badge: "badge--accent",  label: "Abstract" },
};

export function renderArticles(target, data) {
  const all = data.articles || [];
  const title = data.sectionOverrides?.articles?.title || "Publications";
  if (!all.length) return;

  const header = el("header", { class: "section__header container" }, [
    el("div", {}, [
      el("span", { class: "section__eyebrow" }, "Writing"),
      el("h2", { class: "section__title", id: "articles-title" }, title),
      el("p", { class: "section__subtitle" }, "Peer-reviewed articles, reviews, book chapters, and conference abstracts."),
    ]),
  ]);

  const grouped = {};
  for (const a of all) {
    const type = a.type || "research";
    (grouped[type] = grouped[type] || []).push(a);
  }

  const blocks = el("div", { class: "articles__blocks container" },
    GROUP_ORDER.filter(k => grouped[k]?.length).map(k => {
      const meta = GROUP_META[k] || { title: k, icon: "file-text", badge: "", label: k };
      return el("div", { class: "articles__group" }, [
        el("h3", { class: "articles__group-title" }, [icon(meta.icon, { size: "md", className: "icon--accent" }), meta.title]),
        buildCarousel(grouped[k], meta, k),
      ]);
    })
  );

  mount(target, [header, blocks]);
  qsa(".carousel", target).forEach(carousel);
}

function buildCarousel(items, meta, groupKey) {
  return el("div", { class: "carousel", role: "region", "aria-label": meta.title }, [
    el("div", { class: "carousel__viewport" },
      items.map(a => el("article", { class: "carousel__item" }, [articleCard(a, meta, groupKey)]))
    ),
  ]);
}

function articleCard(a, meta) {
  const external = isExternal(a.url);
  const titleContent = a.url
    ? el("a", {
        href: a.url,
        target: external ? "_blank" : null,
        rel: external ? "noopener noreferrer" : null,
      }, [a.title, external && icon("arrow-up-right", { size: "sm" })].filter(Boolean))
    : a.title;

  return el("div", { class: "card reveal" }, [
    a.image?.src && el("div", { class: "card__media" }, [
      el("img", {
        src: asset(a.image.src),
        alt: a.image.alt,
        width: a.image.width || 1200,
        height: a.image.height || 800,
        loading: "lazy",
        decoding: "async",
      }),
    ]),

    el("div", { class: "card__eyebrow" }, [
      el("span", { class: `badge ${meta.badge}` }, meta.label),
      a.year && el("span", { class: "text-mono" }, String(a.year)),
    ].filter(Boolean)),

    el("h4", { class: "card__title" }, titleContent),

    a.venue && el("p", { class: "card__subtitle" }, a.venue),

    a.summary && el("p", { class: "card__body" }, a.summary),

    el("div", { class: "card__meta" }, [
      a.authorship && el("span", { class: "card__meta-item" }, [icon("pen-line", { size: "sm", className: "icon--muted" }), a.authorship]),
      a.impactFactor && el("span", { class: "card__meta-item" }, [icon("trending-up", { size: "sm", className: "icon--muted" }), `IF: ${a.impactFactor}`]),
      a.publicationDate && el("span", { class: "card__meta-item" }, [icon("calendar", { size: "sm", className: "icon--muted" }), formatDate(a.publicationDate)]),
    ].filter(Boolean)),
  ].filter(Boolean));
}
