import { validateData } from "./utils/validate.js";
import { asset } from "./utils/paths.js";

const DATA_URL = "/data.json";

/**
 * Loads data.json, validates required fields, normalizes shapes so renderers
 * can assume a single canonical structure (even if older schemas are used).
 */
export async function loadData() {
  const res = await fetch(DATA_URL, { headers: { Accept: "application/json" }});
  if (!res.ok) {
    throw new Error(`Failed to load data.json (${res.status} ${res.statusText})`);
  }
  const raw = await res.json();
  const data = normalize(raw);
  validateData(data);
  return data;
}

// ── Normalization ──────────────────────────────────────────────────────────
function normalize(d) {
  const out = { ...d };

  out.personal = normalizePersonal(d.personal || {});
  out.social   = d.social || {};
  out.contact  = normalizeContact(d.contact || {});
  out.theme    = d.theme || { defaultMode: "dark" };
  out.meta     = d.meta  || {};

  out.education   = (d.education   || []).map(normalizeEducation);
  out.experience  = (d.experience  || []).map(normalizeExperience);
  out.projects    = (d.projects    || []).map(normalizeProject);
  out.conferences = (d.conferences || []).map(normalizeEvent);
  out.workshops   = (d.workshops   || []).map(normalizeEvent);
  out.articles    = normalizeArticles(d.articles);
  out.certifications = (d.certifications || []).map(normalizeCertification);
  out.milestones  = (d.milestones   || []).map(normalizeMilestone);
  out.testimonials = (d.testimonials || []).map(normalizeTestimonial);
  out.writing     = (d.writing     || []).map(normalizeWriting);
  out.now         = d.now || null;

  out.skills = normalizeSkills(d.skills || {});
  out.summary = d.summary || "";
  out.seo    = d.seo || {};

  out.sections = d.sections || {
    order: [
      "hero","about","milestones","experience","projects",
      "conferences","articles","testimonials","writing","certifications","contact"
    ],
    hidden: [],
  };
  out.sectionOverrides = d.sectionOverrides || {};

  return out;
}

function normalizeImage(input, fallbackAlt = "") {
  if (!input) return null;
  if (typeof input === "string") return { src: asset(input), alt: fallbackAlt, width: null, height: null };
  return {
    src:    asset(input.src),
    alt:    input.alt || fallbackAlt,
    width:  input.width  || null,
    height: input.height || null,
  };
}

function normalizePersonal(p) {
  return {
    name:     p.name || "",
    title:    p.title || "",
    tagline:  p.tagline || "",
    location: p.location || "",
    email:    p.email || "",
    phone:    p.phone || "",
    website:  p.website || "",
    resumeUrl: asset(p.resumeUrl || ""),
    profileImages: (p.profileImages || []).map((img, i) =>
      normalizeImage(img, `${p.name || "Profile"} — photo ${i + 1}`)
    ),
  };
}

function normalizeContact(c) {
  return {
    availability:     c.availability     || "Open to research collaborations",
    preferredContact: c.preferredContact || "email",
    responseTime:     c.responseTime     || "Within 48 hours",
    timezone:         c.timezone         || "",
    form: {
      enabled:    c.form?.enabled    ?? true,
      honeypot:   c.form?.honeypot   ?? true,
      successMsg: c.form?.successMsg || "Thanks — your message is on its way. I'll respond within 48 hours.",
      errorMsg:   c.form?.errorMsg   || "Something went wrong. Please email me directly.",
    },
  };
}

function normalizeEducation(e) {
  return {
    institution: e.institution || "",
    degree: e.degree || "",
    graduationYear: e.graduationYear || "",
    gpa: e.gpa || "",
    relevantCoursework: e.relevantCoursework || [],
  };
}

function normalizeExperience(x) {
  return {
    id: x.id,
    company: x.company || "",
    position: x.position || "",
    duration: x.duration || "",
    location: x.location || "",
    description: x.description || "",
    achievements: x.achievements || [],
    technologies: x.technologies || [],
  };
}

function normalizeLinks(p) {
  const links = [];
  if (Array.isArray(p.links)) return p.links.filter(l => l?.url);
  if (p.liveUrl)   links.push({ label: "Live",   url: p.liveUrl,   kind: "external" });
  if (p.githubUrl) links.push({ label: "Code",   url: p.githubUrl, kind: "github" });
  if (p.url)       links.push({ label: "Link",   url: p.url,       kind: "external" });
  return links;
}

function normalizeProject(p) {
  return {
    id: p.id,
    title: p.title || "",
    subtitle: p.subtitle || "",
    description: p.description || "",
    image: normalizeImage(p.image, p.title),
    technologies: p.technologies || [],
    features: p.features || [],
    links: normalizeLinks(p),
    status: p.status || "completed",
    year: p.year || "",
  };
}

function normalizeEvent(e) {
  return {
    id: e.id,
    title: e.title || "",
    description: e.description || "",
    location: e.location || "",
    date: e.date || "",
    presentationType: e.presentationType || e.mode || "",
    mode: e.mode || e.presentationType || "",
    image: normalizeImage(e.image, e.title),
  };
}

function normalizeArticle(a, type) {
  return {
    id: a.id,
    type: a.type || type,
    title: a.title || "",
    summary: a.summary || "",
    year: a.year || "",
    url: a.url || "",
    image: normalizeImage(a.image, a.title),
    journal: a.journal || a.bookTitle || a.conference || a.publisher || "",
    venue: a.journal || a.bookTitle || a.conference || a.publisher || "",
    impactFactor: a.impactFactor || "",
    authorship: a.authorship || "",
    publicationDate: a.publicationDate || a.date || "",
    location: a.location || "",
    status: a.status || "published",
  };
}

function normalizeArticles(input) {
  if (!input) return [];
  if (Array.isArray(input)) {
    return input.map(a => normalizeArticle(a, (a.type || "research").toLowerCase()));
  }
  const out = [];
  const map = { research: "research", reviews: "review", bookChapters: "bookChapter", abstracts: "abstract" };
  for (const [key, type] of Object.entries(map)) {
    for (const a of input[key] || []) out.push(normalizeArticle(a, type));
  }
  return out;
}

function normalizeCertification(c) {
  return {
    id: c.id,
    title: c.title || "",
    year: c.year || "",
    type: c.type || "Workshop",
    issuer: c.issuer || "",
  };
}

function normalizeMilestone(m) {
  return {
    id: m.id,
    date: m.date || "",
    title: m.title || "",
    description: m.description || "",
    kind: m.kind || "growth",
    icon: m.icon || "sparkles",
  };
}

function normalizeTestimonial(t) {
  return {
    id: t.id,
    quote: t.quote || "",
    author: t.author || "",
    role: t.role || "",
    affiliation: t.affiliation || "",
    relationship: t.relationship || "",
    avatar: normalizeImage(t.avatar, t.author),
  };
}

function normalizeWriting(w) {
  return {
    id: w.id,
    title: w.title || "",
    date:  w.date  || "",
    excerpt: w.excerpt || "",
    url: w.url || "",
    kind: w.kind || (w.url && /^https?:/.test(w.url) ? "external" : "internal"),
    tags: w.tags || [],
  };
}

function normalizeSkills(s) {
  const tech = s.technical || {};
  return {
    technical: {
      programming: tech.programming || [],
      backend:     tech.backend     || [],
      tools:       tech.tools       || [],
      concepts:    tech.concepts    || [],
    },
    soft: s.soft || [],
  };
}
