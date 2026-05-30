import { readdirSync, readFileSync, writeFileSync } from "node:fs";

const PAGES_DIR = "public/pages";
const TARGET_TYPES = new Set(["Article", "FAQPage", "LocalBusiness", "Organization", "Service", "WebPage"]);

function decodeEntities(text) {
  return text
    .replace(/&mdash;/g, "-")
    .replace(/&ndash;/g, "-")
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&nbsp;/g, " ");
}

function stripTags(html) {
  return decodeEntities(html.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim());
}

function visibleDescription(html) {
  const itemprop = html.match(/<p[^>]*itemprop="description"[^>]*>([\s\S]*?)<\/p>/i);
  if (itemprop) return stripTags(itemprop[1]);

  const hero = html.match(/<p[^>]*class="hero-sub"[^>]*>([\s\S]*?)<\/p>/i);
  if (hero) return stripTags(hero[1]);

  const meta = html.match(/<meta name="description" content="([^"]+)">/i);
  return meta ? decodeEntities(meta[1].trim()) : "";
}

function typeMatches(type) {
  if (Array.isArray(type)) return type.some((item) => TARGET_TYPES.has(item));
  return TARGET_TYPES.has(type);
}

function addDescriptions(value, description) {
  if (!value || typeof value !== "object") return value;
  if (Array.isArray(value)) return value.map((item) => addDescriptions(item, description));

  if (typeMatches(value["@type"])) {
    value.description = description;
  }

  for (const [key, child] of Object.entries(value)) {
    if (key === "description") continue;
    value[key] = addDescriptions(child, description);
  }
  return value;
}

function optimizePage(html) {
  const description = visibleDescription(html);
  if (!description) return html;

  return html.replace(/<script type="application\/ld\+json"([^>]*)>\s*([\s\S]*?)\s*<\/script>/g, (match, attrs, json) => {
    try {
      const data = JSON.parse(json);
      const updated = addDescriptions(data, description);
      return `<script type="application/ld+json"${attrs}>\n${JSON.stringify(updated, null, 2)}\n</script>`;
    } catch {
      return match;
    }
  });
}

for (const file of readdirSync(PAGES_DIR).filter((name) => name.endsWith(".html"))) {
  const path = `${PAGES_DIR}/${file}`;
  const html = readFileSync(path, "utf8");
  writeFileSync(path, optimizePage(html));
}

console.log("Optimized JSON-LD description fields from visible page descriptions.");
