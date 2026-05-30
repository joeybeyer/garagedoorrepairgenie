import { existsSync, readdirSync, readFileSync } from "node:fs";

const PAGES_DIR = "public/pages";
const ORIGIN = "https://garagedoorrepairgenie.com";

const pages = readdirSync(PAGES_DIR).filter((file) => file.endsWith(".html")).sort();
const sitemap = existsSync("public/sitemap.xml") ? readFileSync("public/sitemap.xml", "utf8") : "";
const sitemapUrls = new Set(
  [...sitemap.matchAll(/<loc>https:\/\/garagedoorrepairgenie\.com\/(.*?)<\/loc>/g)].map((match) => `/${match[1].replace(/\/$/, "")}/`.replace("//", "/"))
);

function stripTags(html) {
  return html.replace(/<script[\s\S]*?<\/script>/gi, " ").replace(/<style[\s\S]*?<\/style>/gi, " ").replace(/<[^>]+>/g, " ");
}

function decodeEntities(text) {
  return text
    .replace(/&mdash;/g, "-")
    .replace(/&ndash;/g, "-")
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&nbsp;/g, " ");
}

function cleanText(text) {
  return decodeEntities(text.replace(/\s+/g, " ").trim());
}

function visibleDescription(html) {
  const itemprop = html.match(/<p[^>]*itemprop="description"[^>]*>([\s\S]*?)<\/p>/i);
  if (itemprop) return cleanText(stripTags(itemprop[1]));

  const hero = html.match(/<p[^>]*class="hero-sub"[^>]*>([\s\S]*?)<\/p>/i);
  if (hero) return cleanText(stripTags(hero[1]));

  const meta = html.match(/<meta name="description" content="([^"]+)">/i);
  return meta ? cleanText(meta[1]) : "";
}

function schemaDescriptions(html) {
  const descriptions = [];
  for (const match of html.matchAll(/<script type="application\/ld\+json"[^>]*>\s*([\s\S]*?)\s*<\/script>/g)) {
    try {
      collectDescriptions(JSON.parse(match[1]), descriptions);
    } catch {
      // Ignore malformed JSON-LD here; validate-site catches structural page issues.
    }
  }
  return descriptions;
}

function collectDescriptions(value, descriptions) {
  if (!value || typeof value !== "object") return;
  if (Array.isArray(value)) {
    for (const item of value) collectDescriptions(item, descriptions);
    return;
  }
  if (typeof value.description === "string") descriptions.push(cleanText(value.description));
  for (const child of Object.values(value)) collectDescriptions(child, descriptions);
}

function routeFor(file) {
  return file === "home.html" ? "/" : `/${file.replace(/\.html$/, "")}/`;
}

function primaryQuery(html) {
  const h1 = html.match(/<h1[^>]*>([\s\S]*?)<\/h1>/i)?.[1];
  const title = html.match(/<title>([\s\S]*?)<\/title>/i)?.[1];
  return stripTags(h1 || title || "").replace(/\s*\|\s*Garage Door Repair Genie.*$/i, "").trim().toLowerCase();
}

function countExact(text, phrase) {
  if (!phrase) return 0;
  const escaped = phrase.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  return [...text.matchAll(new RegExp(`\\b${escaped}\\b`, "gi"))].length;
}

const rows = pages.map((file) => {
  const html = readFileSync(`${PAGES_DIR}/${file}`, "utf8");
  const route = routeFor(file);
  const body = html.match(/<body[\s\S]*?<\/body>/i)?.[0] || html;
  const text = stripTags(body).replace(/\s+/g, " ").trim();
  const query = primaryQuery(html);
  const schemas = [...html.matchAll(/"@type":\s*"([^"]+)"/g)].map((match) => match[1]);
  const isGeneratedCityService = /^(garage-door-(spring|torsion-spring|opener|cable)-repair|emergency-garage-door-repair|off-track-garage-door-repair)-.+-(or|wa|ga|tx)\.html$/.test(file);
  const visibleDesc = visibleDescription(html);
  const schemaDescs = schemaDescriptions(html);

  return {
    file,
    route,
    words: text ? text.split(/\s+/).length : 0,
    itemprop: /itemprop=/.test(html),
    bold_count: [...html.matchAll(/<(strong|b|em)\b/gi)].length,
    primary_query_body_count: countExact(text.toLowerCase(), query),
    inline_qa: /If .+ choose|trade-off|matters when|matters for/i.test(text),
    schema_description_count: schemaDescs.length,
    schema_description_visible_match: schemaDescs.length > 0 && schemaDescs.every((description) => description === visibleDesc || text.includes(description)),
    canonical: /<link rel="canonical" href="([^"]+)"[^>]*>/i.test(html),
    in_sitemap: sitemapUrls.has(route),
    schemas: [...new Set(schemas)].sort(),
    generated_city_service: isGeneratedCityService
  };
});

const summary = {
  pages: rows.length,
  itemprop_pages: rows.filter((row) => row.itemprop).length,
  generated_city_service_pages: rows.filter((row) => row.generated_city_service).length,
  generated_pages_over_5_bold: rows.filter((row) => row.generated_city_service && row.bold_count > 5).length,
  schema_description_pages: rows.filter((row) => row.schema_description_count > 0).length,
  schema_description_mismatches: rows.filter((row) => row.schema_description_count > 0 && !row.schema_description_visible_match).map((row) => row.file),
  missing_canonical: rows.filter((row) => !row.canonical).map((row) => row.file),
  missing_sitemap: rows.filter((row) => !row.in_sitemap).map((row) => row.file),
  missing_inline_sop: rows.filter((row) => !row.inline_qa).map((row) => row.file)
};

console.log(`pages=${summary.pages}`);
console.log(`itemprop_pages=${summary.itemprop_pages}`);
console.log(`generated_city_service_pages=${summary.generated_city_service_pages}`);
console.log(`generated_pages_over_5_bold=${summary.generated_pages_over_5_bold}`);
console.log(`schema_description_pages=${summary.schema_description_pages}`);
console.log(`schema_description_mismatches=${summary.schema_description_mismatches.length}`);
console.log("");
console.log("| Page | Words | itemprop | Bold | EMQ body count | Inline SOP | Schema descs | Schema desc visible | Schema |");
console.log("| --- | ---: | --- | ---: | ---: | --- | ---: | --- | --- |");
for (const row of rows) {
  console.log(`| ${row.file} | ${row.words} | ${row.itemprop ? "yes" : "no"} | ${row.bold_count} | ${row.primary_query_body_count} | ${row.inline_qa ? "yes" : "no"} | ${row.schema_description_count} | ${row.schema_description_visible_match ? "yes" : "no"} | ${row.schemas.join(", ") || "-"} |`);
}

if (summary.itemprop_pages !== summary.pages) {
  console.error(`Expected itemprop on every page; found ${summary.itemprop_pages}/${summary.pages}.`);
  process.exitCode = 1;
}

if (summary.generated_pages_over_5_bold > 0) {
  const offenders = rows.filter((row) => row.generated_city_service && row.bold_count > 5).map((row) => `${row.file} (${row.bold_count})`);
  console.error(`Generated pages over 5 bold/strong/em tags: ${offenders.join(", ")}`);
  process.exitCode = 1;
}

if (summary.missing_canonical.length || summary.missing_sitemap.length) {
  console.error(`Canonical/sitemap failures: ${JSON.stringify({ missing_canonical: summary.missing_canonical, missing_sitemap: summary.missing_sitemap })}`);
  process.exitCode = 1;
}

if (summary.schema_description_mismatches.length) {
  console.error(`Schema description fields not found in visible content: ${summary.schema_description_mismatches.join(", ")}`);
  process.exitCode = 1;
}
