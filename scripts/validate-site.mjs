import { readdirSync, readFileSync, existsSync } from "node:fs";

const pages = readdirSync("public/pages").filter((file) => file.endsWith(".html"));
const failures = [];

for (const file of pages) {
  const html = readFileSync(`public/pages/${file}`, "utf8");
  const title = html.match(/<title>(.*?)<\/title>/);
  const h1s = [...html.matchAll(/<h1[\s\S]*?<\/h1>/g)];
  const canonical = html.match(/<link rel="canonical" href="(.*?)">/);

  if (!title) failures.push(`${file}: missing title`);
  if (h1s.length !== 1) failures.push(`${file}: expected 1 h1, found ${h1s.length}`);
  if (!canonical) failures.push(`${file}: missing canonical`);
}

const titles = new Map();
for (const file of pages) {
  const html = readFileSync(`public/pages/${file}`, "utf8");
  const title = html.match(/<title>(.*?)<\/title>/)?.[1];
  if (!title) continue;
  titles.set(title, [...(titles.get(title) || []), file]);
}

for (const [title, files] of titles) {
  if (files.length > 1) failures.push(`duplicate title "${title}": ${files.join(", ")}`);
}

const sitemap = readFileSync("public/sitemap.xml", "utf8");
const urls = [...sitemap.matchAll(/<loc>https:\/\/garagedoorrepairgenie\.com\/(.*?)<\/loc>/g)].map((match) => match[1]);

for (const url of urls) {
  const slug = url.replace(/\/$/, "");
  const file = slug === "" ? "home.html" : `${slug}.html`;
  if (!existsSync(`public/pages/${file}`)) failures.push(`sitemap url missing page file: /${url} -> ${file}`);
}

const cityServicePages = pages.filter((file) => /-(or|wa|ga|tx)\.html$/.test(file) && file.split("-").length > 3);
for (const file of cityServicePages) {
  const html = readFileSync(`public/pages/${file}`, "utf8");
  for (const type of ["LocalBusiness", "Service", "FAQPage", "BreadcrumbList"]) {
    if (!html.includes(`"@type": "${type}"`)) failures.push(`${file}: missing ${type} schema`);
  }
}

console.log(`pages=${pages.length}`);
console.log(`sitemap_urls=${urls.length}`);
console.log(`city_service_pages=${cityServicePages.length}`);

if (failures.length) {
  console.error(failures.join("\n"));
  process.exit(1);
}

console.log("validation passed");
