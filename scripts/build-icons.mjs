#!/usr/bin/env node
/**
 * Builds /icons/sprite.svg from lucide-static.
 * Run once per icon-set change, not on every dev server start.
 *
 *   npm run icons
 *
 * To add an icon: add its name to ICONS below, run the script, commit the
 * resulting icons/sprite.svg.
 */
import { readFile, writeFile, mkdir } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { dirname, join, resolve } from "node:path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, "..");

const ICONS = [
  // Contact + basics
  "mail", "phone", "map-pin", "globe", "send", "calendar", "clock",
  // Nav + actions
  "menu", "x", "arrow-right", "arrow-up-right", "arrow-left",
  "chevron-left", "chevron-right", "chevron-down", "chevron-up",
  "download", "external-link", "link",
  // Theme
  "sun", "moon", "monitor",
  // Social / academic
  "github", "linkedin", "twitter",
  // Research / content
  "book-open", "file-text", "briefcase", "graduation-cap", "award",
  "microscope", "beaker", "flask-conical", "dna", "brain", "atom",
  "mic", "users", "sparkles", "rocket", "lightbulb", "trending-up",
  "quote", "pen-line", "newspaper", "hash",
  // Status
  "check", "circle-check", "circle-alert", "info", "loader",
  "circle-dot",
  // Misc
  "search", "eye",
];

async function lucideSvg(name) {
  const path = resolve(
    ROOT,
    "node_modules/lucide-static/icons",
    `${name}.svg`,
  );
  try {
    return await readFile(path, "utf8");
  } catch {
    console.warn(`[icons] skipped missing icon: ${name}`);
    return null;
  }
}

function extractInner(svg) {
  const match = svg.match(/<svg[^>]*>([\s\S]*?)<\/svg>/);
  return match ? match[1].trim() : "";
}

async function main() {
  await mkdir(join(ROOT, "icons"), { recursive: true });

  const symbols = [];
  for (const name of ICONS) {
    const src = await lucideSvg(name);
    if (!src) continue;
    const inner = extractInner(src);
    symbols.push(
      `  <symbol id="${name}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round">${inner}</symbol>`
    );
  }

  const sprite =
    `<?xml version="1.0" encoding="UTF-8"?>\n` +
    `<svg xmlns="http://www.w3.org/2000/svg" style="display:none" aria-hidden="true">\n` +
    symbols.join("\n") +
    `\n</svg>\n`;

  const out = join(ROOT, "icons", "sprite.svg");
  await writeFile(out, sprite, "utf8");
  console.log(`[icons] wrote ${symbols.length} icons to icons/sprite.svg`);
}

main().catch((err) => {
  console.error("[icons] build failed:", err);
  process.exit(1);
});
