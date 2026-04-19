import { qs } from "../dom.js";

export function initContactForm(formEl, config = {}) {
  if (!formEl) return;
  const statusEl = qs("[data-form-status]", formEl);

  formEl.addEventListener("submit", async (e) => {
    e.preventDefault();

    const submitBtn = qs("button[type=submit]", formEl);
    submitBtn?.setAttribute("aria-busy", "true");
    setStatus("");

    const formData = new FormData(formEl);

    // Netlify Forms honeypot — if bot filled the hidden field, bail silently.
    if (formData.get("bot-field")) {
      setStatus(config.successMsg || "Thanks — your message has been sent.");
      submitBtn?.removeAttribute("aria-busy");
      formEl.reset();
      return;
    }

    try {
      const res = await fetch("/", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams(formData).toString(),
      });
      if (!res.ok) throw new Error(`Network error (${res.status})`);
      setStatus(config.successMsg || "Thanks — your message has been sent.", "success");
      formEl.reset();
    } catch (err) {
      console.warn("[contact-form] submit failed:", err);
      setStatus(config.errorMsg || "Something went wrong. Please email directly.", "error");
    } finally {
      submitBtn?.removeAttribute("aria-busy");
    }
  });

  function setStatus(msg, kind = "") {
    if (!statusEl) return;
    statusEl.textContent = msg;
    statusEl.dataset.status = kind;
  }
}
