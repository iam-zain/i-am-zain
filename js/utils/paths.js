/**
 * Single source of truth for asset path resolution.
 * Accepts any of: "images/x.jpg", "/images/x.jpg", "./images/x.jpg"
 * Returns a root-absolute path that works identically on local dev and Netlify.
 */
export function asset(path) {
  if (!path) return "";
  if (/^(https?:)?\/\//.test(path)) return path;
  const cleaned = String(path).trim().replace(/^\.?\/*/, "");
  return `/${cleaned}`;
}

export function isExternal(url) {
  if (!url) return false;
  return /^https?:\/\//i.test(url);
}
