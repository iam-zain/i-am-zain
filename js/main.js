import { loadData } from "./data.js";
import { qs } from "./dom.js";
import { renderMeta } from "./render/meta.js";
import { renderHero } from "./render/hero.js";
import { renderAbout } from "./render/about.js";
import { renderMilestones } from "./render/milestones.js";
import { renderExperience } from "./render/experience.js";
import { renderProjects } from "./render/projects.js";
import { renderConferences } from "./render/conferences.js";
import { renderArticles } from "./render/articles.js";
import { renderTestimonials } from "./render/testimonials.js";
import { renderWriting } from "./render/writing.js";
import { renderCertifications } from "./render/certifications.js";
import { renderContact } from "./render/contact.js";
import { renderFooter } from "./render/footer.js";
import { initNav } from "./components/nav.js";
import { initThemeToggle } from "./components/theme-toggle.js";
import { initReveal } from "./components/reveal.js";

const RENDERERS = {
  hero:           renderHero,
  about:          renderAbout,
  milestones:     renderMilestones,
  experience:     renderExperience,
  projects:       renderProjects,
  conferences:    renderConferences,
  articles:       renderArticles,
  testimonials:   renderTestimonials,
  writing:        renderWriting,
  certifications: renderCertifications,
  contact:        renderContact,
};

async function boot() {
  try {
    const data = await loadData();
    applyTheme(data.theme);
    renderMeta(data);

    const hidden = new Set(data.sections?.hidden || []);
    const order = data.sections?.order || Object.keys(RENDERERS);

    for (const name of order) {
      if (hidden.has(name)) {
        qs(`#${name}`)?.setAttribute("hidden", "");
        continue;
      }
      const render = RENDERERS[name];
      const target = qs(`#${name}`);
      if (render && target) {
        try {
          render(target, data);
          autoHideIfEmpty(target, name, data);
        } catch (err) {
          console.error(`[render:${name}]`, err);
        }
      }
    }

    renderFooter(qs("#site-footer"), data);
    initNav();
    initThemeToggle(data.theme);
    initReveal();

    document.documentElement.dataset.ready = "true";
  } catch (err) {
    console.error("[boot]", err);
    showFatalError(err);
  }
}

function applyTheme(theme) {
  if (!theme) return;
  const root = document.documentElement;
  const stored = localStorage.getItem("theme");
  const mode = stored || theme.defaultMode || "dark";
  if (mode === "light" || mode === "dark") root.setAttribute("data-theme", mode);

  if (theme.accent) root.style.setProperty("--accent", theme.accent);
  if (theme.accent2) root.style.setProperty("--accent-2", theme.accent2);
}

function autoHideIfEmpty(target, name, data) {
  const empty = {
    testimonials:   () => !data.testimonials?.length,
    writing:        () => !data.writing?.length,
    milestones:     () => !data.milestones?.length,
    certifications: () => !data.certifications?.length,
  };
  if (empty[name]?.()) target.setAttribute("hidden", "");
}

function showFatalError(err) {
  const main = qs("main") || document.body;
  main.innerHTML = `
    <div style="padding:4rem 1rem; text-align:center; max-width:600px; margin:auto;">
      <h1 style="font-size:1.5rem; margin-bottom:1rem;">Site couldn't load.</h1>
      <p style="color:var(--text-muted); margin-bottom:1rem;">
        The portfolio data failed to load. Please refresh the page or try again in a moment.
      </p>
      <p style="color:var(--text-muted); font-size:0.85rem; font-family:var(--font-mono);">${err?.message ?? ""}</p>
    </div>
  `;
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", boot, { once: true });
} else {
  boot();
}
