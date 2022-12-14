export function normalizeString(str) {
  return str
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .trim()
}

export function selectors(s) { return s.join(" > ") }
