import { existsSync, readdirSync, readFileSync } from "node:fs";

const BRIEF_PATH = "content-briefs/authority-clusters.json";
const PAGES_DIR = "public/pages";

function readJson(path) {
  return JSON.parse(readFileSync(path, "utf8"));
}

function routeToFile(route) {
  const slug = route.replace(/^\/|\/$/g, "");
  return slug ? `${slug}.html` : "home.html";
}

function pagePath(route) {
  return `${PAGES_DIR}/${routeToFile(route)}`;
}

function routeExists(route) {
  return existsSync(pagePath(route));
}

function routeForServiceCity(serviceBaseSlug, citySlug) {
  if (serviceBaseSlug === "garage-door-repair") return `/garage-door-repair-${citySlug}/`;
  return `/${serviceBaseSlug}-${citySlug}/`;
}

function htmlFor(route) {
  return readFileSync(pagePath(route), "utf8");
}

function hasLink(html, route) {
  const escaped = route.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  return new RegExp(`href="${escaped}"`, "i").test(html);
}

const failures = [];
const warnings = [];

if (!existsSync(BRIEF_PATH)) {
  console.error(`Missing authority brief registry: ${BRIEF_PATH}`);
  process.exit(1);
}

const registry = readJson(BRIEF_PATH);
const pages = readdirSync(PAGES_DIR).filter((file) => file.endsWith(".html"));
const activeClusters = registry.activeClusters || [];
const plannedClusters = registry.plannedClusters || [];
const cities = registry.cities || [];

if (!cities.length) failures.push("authority registry has no cities");
if (!activeClusters.length) failures.push("authority registry has no active clusters");

const rows = [];

for (const cluster of activeClusters) {
  const missingFields = [];
  for (const field of ["id", "hubUrl", "serviceBaseSlug", "primaryIntent", "serpEvidenceStatus", "nextSerpRefresh"]) {
    if (!cluster[field]) missingFields.push(field);
  }
  if (!Array.isArray(cluster.entities) || cluster.entities.length < 5) missingFields.push("entities>=5");
  if (!Array.isArray(cluster.factsWithContext) || cluster.factsWithContext.length < 3) missingFields.push("factsWithContext>=3");
  if (!Array.isArray(cluster.supportQueries) || cluster.supportQueries.length < 3) missingFields.push("supportQueries>=3");
  if (!Array.isArray(cluster.supportUrls) || cluster.supportUrls.length < 2) missingFields.push("supportUrls>=2");

  if (missingFields.length) failures.push(`${cluster.id}: missing brief fields (${missingFields.join(", ")})`);
  if (!routeExists(cluster.hubUrl)) failures.push(`${cluster.id}: hub URL missing (${cluster.hubUrl})`);

  const hubHtml = routeExists(cluster.hubUrl) ? htmlFor(cluster.hubUrl) : "";
  let cityPagesFound = 0;
  let hubCityLinks = 0;
  let cityBackLinks = 0;
  let siblingLinkPages = 0;

  if (cluster.cityPages) {
    for (const city of cities) {
      const cityRoute = routeForServiceCity(cluster.serviceBaseSlug, city);
      if (!routeExists(cityRoute)) {
        failures.push(`${cluster.id}: city page missing (${cityRoute})`);
        continue;
      }

      cityPagesFound += 1;
      if (hubHtml && hasLink(hubHtml, cityRoute)) hubCityLinks += 1;

      const cityHtml = htmlFor(cityRoute);
      const cityRootRoute = `/garage-door-repair-${city}/`;
      if (cityRoute === cityRootRoute || hasLink(cityHtml, cityRootRoute)) cityBackLinks += 1;

      const siblingLinks = activeClusters
        .filter((other) => other.cityPages && other.serviceBaseSlug !== cluster.serviceBaseSlug)
        .map((other) => routeForServiceCity(other.serviceBaseSlug, city))
        .filter((route) => routeExists(route) && hasLink(cityHtml, route));

      if (siblingLinks.length >= 4) siblingLinkPages += 1;
    }

    if (hubCityLinks !== cities.length) failures.push(`${cluster.id}: hub links to ${hubCityLinks}/${cities.length} city pages`);
    if (cityBackLinks !== cities.length) failures.push(`${cluster.id}: ${cityBackLinks}/${cities.length} city pages link back to city root`);
    if (siblingLinkPages !== cities.length) failures.push(`${cluster.id}: ${siblingLinkPages}/${cities.length} city pages have at least 4 sibling service links`);
  }

  let supportUrlsFound = 0;
  for (const supportUrl of cluster.supportUrls || []) {
    if (routeExists(supportUrl)) supportUrlsFound += 1;
    else warnings.push(`${cluster.id}: support URL not found (${supportUrl})`);
  }

  rows.push({
    id: cluster.id,
    hub: cluster.hubUrl,
    cityPagesFound,
    hubCityLinks,
    cityBackLinks,
    siblingLinkPages,
    entities: cluster.entities?.length || 0,
    facts: cluster.factsWithContext?.length || 0,
    supportUrlsFound,
    serpEvidenceStatus: cluster.serpEvidenceStatus
  });
}

const plannedWithReason = plannedClusters.filter((cluster) => cluster.reason && cluster.candidateHubUrl).length;
if (plannedClusters.length && plannedWithReason !== plannedClusters.length) {
  failures.push(`planned clusters missing reason/candidateHubUrl: ${plannedWithReason}/${plannedClusters.length}`);
}

console.log(`pages=${pages.length}`);
console.log(`active_clusters=${activeClusters.length}`);
console.log(`planned_clusters=${plannedClusters.length}`);
console.log(`cities=${cities.length}`);
console.log("");
console.log("| Cluster | Hub | City pages | Hub city links | City root links | Sibling link pages | Entities | Facts | Support URLs | SERP status |");
console.log("| --- | --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: | --- |");
for (const row of rows) {
  console.log(`| ${row.id} | ${row.hub} | ${row.cityPagesFound} | ${row.hubCityLinks} | ${row.cityBackLinks} | ${row.siblingLinkPages} | ${row.entities} | ${row.facts} | ${row.supportUrlsFound} | ${row.serpEvidenceStatus} |`);
}

if (warnings.length) {
  console.error(`Warnings:\n${warnings.join("\n")}`);
}

if (failures.length) {
  console.error(`Failures:\n${failures.join("\n")}`);
  process.exit(1);
}
