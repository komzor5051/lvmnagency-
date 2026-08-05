/**
 * Safe JSON-LD serialization for <script type="application/ld+json"> blocks.
 *
 * JSON.stringify does not escape < > &, so a string containing "</script>"
 * would terminate the block early and let the rest render as markup. Escaping
 * those three characters as \uXXXX keeps the JSON semantically identical while
 * making early termination impossible.
 */
export function jsonLd(obj: unknown): string {
  return JSON.stringify(obj)
    .replace(/</g, "\\u003c")
    .replace(/>/g, "\\u003e")
    .replace(/&/g, "\\u0026");
}
