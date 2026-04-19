#!/usr/bin/env node
/**
 * Build-time validator for data.json.
 * - Checks required fields
 * - Verifies every referenced image/document exists on disk
 * - Exits non-zero on failure so the Netlify build fails loudly
 */
import { readFile, access } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { dirname, resolve, join } from "node:path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, "..");
const DATA = join(ROOT, "data.json");

const REQUIRED_SCALARS = [
  "personal.name",
  "personal.title",
  "personal.email",
  "summary",
];

const errors = [];
const warnings = [];

async function exists(p) {
  try { await access(p); return true; } catch { return false; }
}

function pluck(obj, pathStr) {
  return pathStr.split(".").reduce((a, k) => (a == null ? a : a[k]), obj);
}

function isLocalAsset(url) {
  if (!url) return false;
  if (/^https?:\/\//i.test(url)) return false;
  if (url.startsWith("mailto:") || url.startsWith("tel:")) return false;
  return url.startsWith("/") || !url.includes("://");
}

async function checkAsset(url, context) {
  if (!isLocalAsset(url)) return;
  const cleaned = String(url).replace(/^\.?\/*/, "");
  const abs = join(ROOT, cleaned);
  if (!(await exists(abs))) {
    errors.push(`Missing asset: ${url} (referenced from ${context})`);
  }
}

function collectImages(data) {
  const refs = [];
  const push = (img, ctx) => {
    if (!img) return;
    const src = typeof img === "string" ? img : img.src;
    if (src) refs.push({ src, ctx });
  };

  (data.personal?.profileImages || []).forEach((img, i) => push(img, `personal.profileImages[${i}]`));
  (data.projects   || []).forEach((p, i) => push(p.image, `projects[${i}].image`));
  (data.conferences|| []).forEach((c, i) => push(c.image, `conferences[${i}].image`));
  (data.workshops  || []).forEach((w, i) => push(w.image, `workshops[${i}].image`));
  (data.testimonials|| []).forEach((t, i) => push(t.avatar, `testimonials[${i}].avatar`));

  const articles = data.articles;
  if (Array.isArray(articles)) {
    articles.forEach((a, i) => push(a.image, `articles[${i}].image`));
  } else if (articles) {
    for (const [group, arr] of Object.entries(articles)) {
      (arr || []).forEach((a, i) => push(a.image, `articles.${group}[${i}].image`));
    }
  }

  if (data.personal?.resumeUrl) refs.push({ src: data.personal.resumeUrl, ctx: "personal.resumeUrl" });
  if (data.seo?.ogImage) refs.push({ src: data.seo.ogImage, ctx: "seo.ogImage" });
  return refs;
}

async function main() {
  let data;
  try {
    const raw = await readFile(DATA, "utf8");
    data = JSON.parse(raw);
  } catch (err) {
    console.error(`[validate] failed to read or parse data.json: ${err.message}`);
    process.exit(1);
  }

  for (const path of REQUIRED_SCALARS) {
    const value = pluck(data, path);
    if (value == null || value === "") errors.push(`Missing required field: ${path}`);
  }

  const refs = collectImages(data);
  for (const { src, ctx } of refs) {
    await checkAsset(src, ctx);
  }

  if (warnings.length) {
    console.warn("[validate] warnings:");
    for (const w of warnings) console.warn("  - " + w);
  }

  if (errors.length) {
    console.error("[validate] FAILED — " + errors.length + " issue(s):");
    for (const e of errors) console.error("  - " + e);
    process.exit(1);
  }

  console.log(`[validate] OK — checked ${refs.length} assets, all present.`);
}

main().catch((err) => {
  console.error("[validate] uncaught error:", err);
  process.exit(1);
});
