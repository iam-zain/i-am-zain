import { asset } from "../utils/paths.js";

export function renderMeta(data) {
  const { personal, seo, social } = data;
  const title = seo?.metaTitle || `${personal.name} — ${personal.title}`;
  const description = seo?.metaDescription || data.summary?.slice(0, 160) || "";
  const url = personal.website || "";
  const image = seo?.ogImage ? asset(seo.ogImage) : "";

  document.title = title;
  setMeta("description", description);

  setLink({ rel: "canonical", href: url });

  // Open Graph
  setMetaProp("og:type", "website");
  setMetaProp("og:title", title);
  setMetaProp("og:description", description);
  setMetaProp("og:url", url);
  if (image) setMetaProp("og:image", image);

  // Twitter
  setMeta("twitter:card", image ? "summary_large_image" : "summary");
  setMeta("twitter:title", title);
  setMeta("twitter:description", description);
  if (image) setMeta("twitter:image", image);

  // Keywords (author-hinted)
  if (seo?.keywords?.length) setMeta("keywords", seo.keywords.join(", "));

  // JSON-LD Person schema
  injectJsonLd({
    "@context": "https://schema.org",
    "@type": "Person",
    "name": personal.name,
    "jobTitle": personal.title,
    "description": data.summary,
    "email": personal.email ? `mailto:${personal.email}` : undefined,
    "url": url,
    "image": image || undefined,
    "address": personal.location ? {
      "@type": "PostalAddress",
      "addressLocality": personal.location,
    } : undefined,
    "sameAs": Object.values(social || {}).filter(Boolean),
  });
}

function setMeta(name, content) {
  if (!content) return;
  let m = document.querySelector(`meta[name="${name}"]`);
  if (!m) {
    m = document.createElement("meta");
    m.setAttribute("name", name);
    document.head.appendChild(m);
  }
  m.setAttribute("content", content);
}

function setMetaProp(prop, content) {
  if (!content) return;
  let m = document.querySelector(`meta[property="${prop}"]`);
  if (!m) {
    m = document.createElement("meta");
    m.setAttribute("property", prop);
    document.head.appendChild(m);
  }
  m.setAttribute("content", content);
}

function setLink({ rel, href }) {
  if (!href) return;
  let link = document.querySelector(`link[rel="${rel}"]`);
  if (!link) {
    link = document.createElement("link");
    link.setAttribute("rel", rel);
    document.head.appendChild(link);
  }
  link.setAttribute("href", href);
}

function injectJsonLd(obj) {
  const clean = JSON.parse(JSON.stringify(obj, (_, v) => (v === undefined || v === "" ? undefined : v)));
  const script = document.createElement("script");
  script.type = "application/ld+json";
  script.textContent = JSON.stringify(clean, null, 2);
  document.head.appendChild(script);
}
