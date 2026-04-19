import { el, mount } from "../dom.js";
import { icon, iconForKind } from "../icon.js";
import { formatDate } from "../utils/format.js";

export function renderFooter(target, data) {
  if (!target) return;
  const { personal, social, meta, now } = data;
  const year = new Date().getFullYear();

  const inner = el("div", { class: "container site-footer__inner" }, [
    el("div", { class: "site-footer__brand" }, [
      el("div", { class: "site-footer__name" }, personal.name),
      el("div", { class: "site-footer__tagline" }, personal.title),
    ]),

    social && el("div", { class: "site-footer__social cluster" },
      Object.entries(social).filter(([, v]) => v).map(([k, v]) =>
        el("a", {
          href: v,
          target: "_blank",
          rel: "noopener noreferrer",
          class: "btn btn--icon btn--ghost",
          "aria-label": k,
        }, [icon(iconForKind(k), { size: "md", label: null })])
      )
    ),

    el("div", { class: "site-footer__bottom" }, [
      el("div", {}, `© ${year} ${personal.name}. All rights reserved.`),
      el("div", { class: "site-footer__meta" }, [
        meta?.lastUpdated && el("span", {}, `Updated ${formatDate(meta.lastUpdated)}`),
        now?.asOf && el("span", {}, `Now · ${formatDate(now.asOf)}`),
      ].filter(Boolean)),
    ]),
  ].filter(Boolean));

  mount(target, inner);
}
