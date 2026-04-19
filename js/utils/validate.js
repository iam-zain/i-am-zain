/**
 * Runtime schema validation for data.json.
 * Fails loudly (console.error + thrown) for required-field issues so the
 * client notices missing fields during their edits.
 */
const REQUIRED = {
  "personal.name":  "string",
  "personal.title": "string",
  "personal.email": "string",
  "summary":        "string",
};

export function validateData(data) {
  const errors = [];

  for (const [pathStr, type] of Object.entries(REQUIRED)) {
    const value = pluck(data, pathStr);
    if (value === undefined || value === null || value === "") {
      errors.push(`Missing required field: ${pathStr}`);
      continue;
    }
    if (typeof value !== type) {
      errors.push(`Field ${pathStr} should be ${type}, got ${typeof value}`);
    }
  }

  if (errors.length) {
    const msg = `[data.json] ${errors.length} issue(s):\n  - ${errors.join("\n  - ")}`;
    console.error(msg);
    throw new Error(msg);
  }
  return data;
}

function pluck(obj, path) {
  return path.split(".").reduce((acc, key) => (acc == null ? acc : acc[key]), obj);
}
