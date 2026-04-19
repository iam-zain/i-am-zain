const MONTHS_SHORT = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
const MONTHS_LONG  = ["January","February","March","April","May","June","July","August","September","October","November","December"];

/**
 * Accepts:
 *   "2024-09-27"    -> "Sep 2024"
 *   "2024-09"       -> "Sep 2024"
 *   "2024"          -> "2024"
 *   "29 Sept 2024"  -> passthrough (free-form already)
 * Returns a best-effort short date string.
 */
export function formatDate(input, { long = false } = {}) {
  if (!input) return "";
  const str = String(input).trim();
  const months = long ? MONTHS_LONG : MONTHS_SHORT;

  const iso = /^(\d{4})(?:-(\d{1,2}))?(?:-(\d{1,2}))?$/.exec(str);
  if (iso) {
    const [, y, m, d] = iso;
    if (d) return `${months[+m - 1]} ${+d}, ${y}`;
    if (m) return `${months[+m - 1]} ${y}`;
    return y;
  }

  return str;
}

export function formatYear(input) {
  if (!input) return "";
  const match = /\d{4}/.exec(String(input));
  return match ? match[0] : String(input);
}

/** Best-effort sort key from a free-form date string. */
export function dateSortKey(input) {
  if (!input) return 0;
  const iso = /^(\d{4})(?:-(\d{1,2}))?(?:-(\d{1,2}))?/.exec(String(input).trim());
  if (iso) {
    const [, y, m = "01", d = "01"] = iso;
    return new Date(`${y}-${m.padStart(2,"0")}-${d.padStart(2,"0")}`).getTime();
  }
  const y = /\d{4}/.exec(String(input));
  return y ? new Date(`${y[0]}-01-01`).getTime() : 0;
}

export function pluralize(n, singular, plural) {
  return `${n} ${n === 1 ? singular : (plural ?? singular + "s")}`;
}
