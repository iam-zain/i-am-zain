import { el, mount, qs } from "../dom.js";
import { icon, iconForKind } from "../icon.js";
import { initContactForm } from "../components/form.js";

export function renderContact(target, data) {
  const { personal, contact, social } = data;
  const title = data.sectionOverrides?.contact?.title || "Get in touch";

  const header = el("header", { class: "section__header container" }, [
    el("div", {}, [
      el("span", { class: "section__eyebrow" }, "Contact"),
      el("h2", { class: "section__title", id: "contact-title" }, title),
      el("p", { class: "section__subtitle" }, contact?.availability || "Open to research collaborations and academic opportunities."),
    ]),
  ]);

  const infoCard = el("aside", { class: "card contact__info reveal" }, [
    el("h3", { class: "contact__info-title" }, "Reach out directly"),
    el("ul", { class: "contact__info-list" }, [
      personal.email && infoItem("mail", "Email", el("a", { href: `mailto:${personal.email}` }, personal.email)),
      personal.phone && infoItem("phone", "Phone", el("a", { href: `tel:${personal.phone.replace(/\s+/g, "")}` }, personal.phone)),
      personal.location && infoItem("map-pin", "Location", personal.location),
      contact?.responseTime && infoItem("clock", "Response", contact.responseTime),
      contact?.timezone && infoItem("globe", "Timezone", contact.timezone),
    ].filter(Boolean)),

    social && el("div", { class: "contact__social" }, [
      el("div", { class: "contact__social-label" }, "Elsewhere on the web"),
      el("div", { class: "cluster" },
        Object.entries(social).filter(([, v]) => v).map(([k, v]) =>
          el("a", {
            class: "btn btn--icon btn--ghost",
            href: v,
            target: "_blank",
            rel: "noopener noreferrer",
            "aria-label": labelFor(k),
          }, [icon(iconForKind(k), { size: "md", label: null })])
        )
      ),
    ]),
  ]);

  const form = contact?.form?.enabled !== false ? buildForm(data) : null;

  const layout = el("div", { class: "container contact__layout" }, [
    infoCard,
    form,
  ].filter(Boolean));

  mount(target, [header, layout]);

  if (form) {
    initContactForm(qs(".contact-form", target), contact?.form);
  }
}

function infoItem(iconName, label, value) {
  return el("li", { class: "contact__info-item" }, [
    el("span", { class: "contact__info-icon", "aria-hidden": "true" }, [icon(iconName, { size: "sm" })]),
    el("div", {}, [
      el("div", { class: "contact__info-label" }, label),
      el("div", { class: "contact__info-value" }, value),
    ]),
  ]);
}

function labelFor(k) {
  return ({ github: "GitHub", linkedin: "LinkedIn", twitter: "Twitter / X",
           researchgate: "ResearchGate", orcid: "ORCID", scholar: "Google Scholar" })[k] || k;
}

function buildForm(data) {
  return el("form", {
    class: "contact-form reveal",
    name: "contact",
    method: "POST",
    "data-netlify": "true",
    "data-netlify-honeypot": "bot-field",
    novalidate: "true",
  }, [
    el("input", { type: "hidden", name: "form-name", value: "contact" }),
    el("p", { class: "field field--honeypot", "aria-hidden": "true" }, [
      el("label", {}, ["Don't fill this out: ", el("input", { name: "bot-field", tabindex: "-1" })]),
    ]),

    el("div", { class: "contact-form__grid" }, [
      formField({ name: "name", label: "Your name", type: "text", required: true, autocomplete: "name" }),
      formField({ name: "email", label: "Your email", type: "email", required: true, autocomplete: "email" }),
    ]),

    formField({ name: "subject", label: "Subject", type: "text", required: true }),
    formField({ name: "message", label: "Message", type: "textarea", required: true, rows: 6 }),

    el("div", { class: "contact-form__footer" }, [
      el("button", { type: "submit", class: "btn btn--primary btn--lg" }, [
        icon("send", { size: "md" }),
        "Send message",
      ]),
      el("div", { class: "contact-form__status", "data-form-status": "", role: "status", "aria-live": "polite" }),
    ]),
  ]);
}

function formField({ name, label, type = "text", required, autocomplete, rows = 4 }) {
  const id = `field-${name}`;
  const control = type === "textarea"
    ? el("textarea", { id, name, class: "textarea", rows, required: required ? "" : null, autocomplete })
    : el("input", { id, name, type, class: "input", required: required ? "" : null, autocomplete });

  return el("div", { class: "field" }, [
    el("label", { class: "field__label", for: id }, [
      label,
      required && el("span", { class: "field__required", "aria-hidden": "true" }, " *"),
    ].filter(Boolean)),
    control,
  ]);
}
