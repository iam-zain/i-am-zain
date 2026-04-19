import { el, mount, qs, qsa } from "../dom.js";
import { icon, iconForKind } from "../icon.js";
import { formatDate } from "../utils/format.js";
import { asset } from "../utils/paths.js";

const AUTO_ADVANCE_MS = 5500;

export function renderHero(target, data) {
  const { personal, now, social } = data;
  const profiles = (personal.profileImages || []).filter(p => p?.src);

  const content = el("div", { class: "hero__content" }, [
    now?.text && el("div", { class: "hero__now", title: now.asOf ? `Updated ${formatDate(now.asOf, { long: true })}` : "" }, [
      el("span", { class: "hero__now-dot", "aria-hidden": "true" }),
      el("span", { class: "hero__now-label" }, "Now"),
      el("span", { class: "hero__now-text" }, now.text),
    ]),

    el("h1", { class: "hero__title", id: "hero-title" }, [
      personal.name,
      el("span", { class: "hero__title-accent" }, "."),
    ]),

    el("p", { class: "hero__lead" }, [
      el("span", { class: "text-gradient" }, personal.title),
      " — ",
      personal.tagline,
    ]),

    el("div", { class: "hero__meta" }, [
      personal.location && el("span", { class: "hero__meta-item" }, [icon("map-pin", { size: "sm" }), personal.location]),
      personal.email    && el("a", { class: "hero__meta-item", href: `mailto:${personal.email}` }, [icon("mail", { size: "sm" }), personal.email]),
    ].filter(Boolean)),

    el("div", { class: "hero__cta" }, [
      personal.resumeUrl && el("a", {
        class: "btn btn--primary btn--lg",
        href: asset(personal.resumeUrl),
        target: "_blank",
        rel: "noopener",
      }, [icon("download", { size: "md" }), "Download CV"]),

      el("a", {
        class: "btn btn--secondary btn--lg",
        href: "#contact",
      }, ["Get in touch", icon("arrow-right", { size: "md" })]),
    ].filter(Boolean)),

    renderSocialRow(social),
  ].filter(Boolean));

  const portrait = profiles.length ? buildPortraitCarousel(profiles) : null;

  const layout = el("div", { class: "hero__layout container" }, [content, portrait].filter(Boolean));

  target.classList.add("hero");
  mount(target, layout);

  if (profiles.length > 1) initPortraitCarousel(target);
}

function buildPortraitCarousel(profiles) {
  const slides = profiles.map((p, i) =>
    el("img", {
      class: "hero__portrait-slide",
      src: asset(p.src),
      alt: p.alt || "",
      width: p.width || 720,
      height: p.height || 960,
      loading: i === 0 ? "eager" : "lazy",
      fetchpriority: i === 0 ? "high" : null,
      decoding: "async",
      "data-slide": i,
      "aria-hidden": i === 0 ? "false" : "true",
    })
  );

  const dots = profiles.length > 1 ? el("div", {
    class: "hero__portrait-dots",
    role: "tablist",
    "aria-label": "Profile photo selector",
  }, profiles.map((_, i) =>
    el("button", {
      type: "button",
      class: "hero__portrait-dot",
      role: "tab",
      "aria-label": `Show photo ${i + 1} of ${profiles.length}`,
      "aria-selected": i === 0 ? "true" : "false",
      "data-slide": i,
    })
  )) : null;

  return el("figure", {
    class: "hero__portrait",
    tabindex: profiles.length > 1 ? "0" : null,
    "aria-roledescription": profiles.length > 1 ? "carousel" : null,
  }, [
    ...slides,
    el("div", { class: "hero__portrait-glow", "aria-hidden": "true" }),
    dots,
  ].filter(Boolean));
}

function initPortraitCarousel(target) {
  const carousel = qs(".hero__portrait", target);
  if (!carousel) return;
  const slides = qsa(".hero__portrait-slide", carousel);
  const dots = qsa(".hero__portrait-dot", carousel);
  if (slides.length < 2) return;

  let index = 0;
  let timer = null;
  const reduceMotion = matchMedia("(prefers-reduced-motion: reduce)").matches;

  const show = (i) => {
    const next = ((i % slides.length) + slides.length) % slides.length;
    slides.forEach((s, si) => {
      const active = si === next;
      s.classList.toggle("is-active", active);
      s.setAttribute("aria-hidden", String(!active));
    });
    dots.forEach((d, di) => d.setAttribute("aria-selected", String(di === next)));
    index = next;
  };

  const start = () => {
    if (reduceMotion) return;
    stop();
    timer = setInterval(() => show(index + 1), AUTO_ADVANCE_MS);
  };
  const stop = () => { if (timer) { clearInterval(timer); timer = null; } };

  dots.forEach((d) => {
    d.addEventListener("click", () => { show(Number(d.dataset.slide)); start(); });
  });

  carousel.addEventListener("keydown", (e) => {
    if (e.key === "ArrowLeft")  { e.preventDefault(); show(index - 1); start(); }
    if (e.key === "ArrowRight") { e.preventDefault(); show(index + 1); start(); }
  });

  carousel.addEventListener("mouseenter", stop);
  carousel.addEventListener("mouseleave", start);
  carousel.addEventListener("focusin", stop);
  carousel.addEventListener("focusout", start);

  document.addEventListener("visibilitychange", () => {
    if (document.hidden) stop(); else start();
  });

  slides[0].classList.add("is-active");
  start();
}

function renderSocialRow(social = {}) {
  const entries = Object.entries(social).filter(([, v]) => v);
  if (!entries.length) return null;

  const KIND_LABELS = {
    github: "GitHub", linkedin: "LinkedIn", twitter: "Twitter/X",
    researchgate: "ResearchGate", orcid: "ORCID", scholar: "Google Scholar",
  };

  return el("div", { class: "hero__social", role: "list" },
    entries.map(([key, url]) =>
      el("a", {
        class: "btn btn--icon btn--ghost",
        href: url,
        target: "_blank",
        rel: "noopener noreferrer",
        "aria-label": KIND_LABELS[key] || key,
        role: "listitem",
      }, [icon(iconForKind(key), { size: "md", label: null })])
    )
  );
}
