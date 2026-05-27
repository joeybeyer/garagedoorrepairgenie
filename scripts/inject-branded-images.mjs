import { readdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const PAGES_DIR = "public/pages";
const ORIGIN = "https://garagedoorrepairgenie.com";

function imageForSlug(slug) {
  if (slug.includes("emergency") || slug.includes("stuck-open") || slug.includes("stuck-closed")) return "emergency-garage-door-repair.webp";
  if (slug.includes("opener")) return "garage-door-opener-repair.webp";
  if (slug.includes("cable") || slug.includes("wire")) return "garage-door-cable-repair.webp";
  if (slug.includes("off-track") || slug.includes("come-off-track")) return "off-track-garage-door-repair.webp";
  if (slug.includes("how-much") || slug.includes("cost")) return "garage-door-repair-cost.webp";
  if (slug.includes("spring") || slug.includes("torsion")) return "garage-door-spring-repair.webp";
  return "garage-door-repair-service.webp";
}

function escapeAttr(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll('"', "&quot;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;");
}

for (const file of readdirSync(PAGES_DIR).filter((name) => name.endsWith(".html"))) {
  const slug = file.replace(/\.html$/, "");
  const filePath = join(PAGES_DIR, file);
  let html = readFileSync(filePath, "utf8");
  if (!html.includes('class="hero hero-service"')) continue;

  const image = imageForSlug(slug);
  const imagePath = `/images/branded/${image}`;
  const h1 = html.match(/<h1>([\s\S]*?)<\/h1>/)?.[1]?.replace(/<[^>]+>/g, "").replace(/\s+/g, " ").trim() || "Garage Door Repair Genie service";
  const alt = `${h1} from Garage Door Repair Genie`;

  if (!html.includes('property="og:image"')) {
    html = html.replace('<meta property="og:type" content="website">', `<meta property="og:type" content="website">\n<meta property="og:image" content="${ORIGIN}${imagePath}">`);
    html = html.replace('<meta property="og:type" content="article">', `<meta property="og:type" content="article">\n<meta property="og:image" content="${ORIGIN}${imagePath}">`);
  } else {
    html = html.replace(/<meta property="og:image" content="[^"]*">/, `<meta property="og:image" content="${ORIGIN}${imagePath}">`);
  }

  const figure = `<figure class="hero-media">
      <img src="${imagePath}" alt="${escapeAttr(alt)}" width="1200" height="675" loading="eager" fetchpriority="high">
    </figure>`;

  if (!html.includes('class="hero-media"')) {
    html = html.replace(
      /<section class="hero hero-service">\s*<div class="container">\s*([\s\S]*?)\n  <\/div>\s*<\/section>/,
      `<section class="hero hero-service">\n  <div class="container">\n    <div class="hero-copy">\n$1\n    </div>\n    ${figure}\n  </div>\n</section>`
    );
  } else {
    html = html.replace(/<figure class="hero-media">[\s\S]*?<\/figure>/, figure);
  }

  writeFileSync(filePath, html);
}
