import { el, qs } from "../dom.js";
import { icon } from "../icon.js";

const MODES = [
  { value: "system", label: "System theme",  iconName: "monitor" },
  { value: "light",  label: "Light theme",   iconName: "sun" },
  { value: "dark",   label: "Dark theme",    iconName: "moon" },
];

export function initThemeToggle(theme) {
  const mount = qs("#theme-toggle-mount");
  if (!mount) return;

  const current = () => {
    const stored = localStorage.getItem("theme");
    if (stored === "light" || stored === "dark") return stored;
    if (localStorage.getItem("theme") === "system") return "system";
    return "system";
  };

  const apply = (mode) => {
    const root = document.documentElement;
    if (mode === "system") {
      root.removeAttribute("data-theme");
      localStorage.setItem("theme", "system");
    } else {
      root.setAttribute("data-theme", mode);
      localStorage.setItem("theme", mode);
    }
    updateState();
  };

  const container = el("div", { class: "theme-toggle", role: "group", "aria-label": "Theme" });
  const buttons = MODES.map(m =>
    el("button", {
      type: "button",
      class: "theme-toggle__btn",
      "data-mode": m.value,
      "aria-label": m.label,
      "aria-pressed": "false",
      onclick: () => apply(m.value),
    }, [icon(m.iconName, { size: "sm", label: null })])
  );
  buttons.forEach(b => container.append(b));
  mount.replaceChildren(container);

  function updateState() {
    const mode = current();
    buttons.forEach(b => {
      b.setAttribute("aria-pressed", String(b.dataset.mode === mode));
    });
  }

  updateState();
}
