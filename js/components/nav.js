import { el, qs, qsa, mount } from "../dom.js";
import { icon } from "../icon.js";

const NAV_ITEMS = [
  { href: "#about",       label: "About" },
  { href: "#milestones",  label: "Journey" },
  { href: "#experience",  label: "Experience" },
  { href: "#projects",    label: "Projects" },
  { href: "#conferences", label: "Talks" },
  { href: "#articles",    label: "Publications" },
  { href: "#contact",     label: "Contact" },
];

export function initNav() {
  const nav = qs("#site-nav");
  if (!nav) return;

  const brandMark = el("span", { class: "site-nav__brand-mark", "aria-hidden": "true" }, "Z");
  const brandName = el("span", {}, "Zain");
  const brand = el("a", { class: "site-nav__brand", href: "#hero", "aria-label": "Home" }, [brandMark, brandName]);

  const links = el("nav", { class: "site-nav__links", "aria-label": "Primary" },
    NAV_ITEMS.map(item =>
      el("a", { class: "site-nav__link", href: item.href, "data-nav": item.href.slice(1) }, item.label)
    )
  );

  const toggle = el("button", {
    class: "site-nav__mobile-toggle",
    type: "button",
    "aria-label": "Open menu",
    "aria-expanded": "false",
    "aria-controls": "site-nav-drawer",
  }, [icon("menu", { label: null })]);

  const actions = el("div", { class: "site-nav__actions" }, [
    el("div", { id: "theme-toggle-mount" }),
    toggle,
  ]);

  const drawer = el("div", { class: "site-nav__drawer", id: "site-nav-drawer" },
    NAV_ITEMS.map(item =>
      el("a", { class: "site-nav__link", href: item.href, "data-nav": item.href.slice(1) }, item.label)
    )
  );

  const inner = el("div", { class: "site-nav__inner" }, [brand, links, actions]);
  mount(nav, [inner, drawer]);

  toggle.addEventListener("click", () => {
    const open = nav.getAttribute("data-open") === "true";
    nav.setAttribute("data-open", String(!open));
    toggle.setAttribute("aria-expanded", String(!open));
    toggle.setAttribute("aria-label", open ? "Open menu" : "Close menu");
    toggle.replaceChildren(icon(open ? "menu" : "x", { label: null }));
    document.body.style.overflow = open ? "" : "hidden";
  });

  drawer.addEventListener("click", (e) => {
    if (e.target.closest(".site-nav__link")) {
      nav.setAttribute("data-open", "false");
      toggle.setAttribute("aria-expanded", "false");
      toggle.replaceChildren(icon("menu", { label: null }));
      document.body.style.overflow = "";
    }
  });

  setupScrollState(nav);
  setupScrollSpy(nav);
}

function setupScrollState(nav) {
  const onScroll = () => {
    nav.setAttribute("data-scrolled", String(window.scrollY > 8));
  };
  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });
}

function setupScrollSpy(nav) {
  const targets = qsa("main section[id]");
  if (!targets.length) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const id = entry.target.id;
          qsa(`[data-nav]`, nav).forEach((link) => {
            link.setAttribute("aria-current", String(link.dataset.nav === id));
          });
        }
      });
    },
    { rootMargin: "-40% 0px -55% 0px", threshold: 0 }
  );

  targets.forEach((t) => observer.observe(t));
}
