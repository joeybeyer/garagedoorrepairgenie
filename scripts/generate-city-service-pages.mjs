import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const ORIGIN = "https://garagedoorrepairgenie.com";
const PHONE_DISPLAY = "(000) 000-0000";
const PHONE_TEL = "+10000000000";
const PAGES_DIR = "public/pages";

const cities = [
  { slug: "portland-or", name: "Portland", state: "OR", stateName: "Oregon", nearby: ["Pearl District", "Sellwood-Moreland", "Alberta Arts District", "Hawthorne", "St. Johns", "Laurelhurst", "Northwest Portland", "Southeast Portland", "Northeast Portland"] },
  { slug: "vancouver-wa", name: "Vancouver", state: "WA", stateName: "Washington", nearby: ["Hazel Dell", "Salmon Creek", "Felida", "Orchards", "Cascade Park", "Fishers Landing", "Downtown Vancouver", "Minnehaha", "Walnut Grove"] },
  { slug: "savannah-ga", name: "Savannah", state: "GA", stateName: "Georgia", nearby: ["Downtown Savannah", "Midtown", "Ardsley Park", "Southside", "Georgetown", "Pooler", "Garden City", "Thunderbolt", "Isle of Hope", "Skidaway Island"] },
  { slug: "marietta-ga", name: "Marietta", state: "GA", stateName: "Georgia", nearby: ["East Cobb", "West Cobb", "Fair Oaks", "Powers Park", "Whitlock", "Sandy Plains", "Kennesaw Mountain area", "Elizabeth", "Blackwell"] },
  { slug: "atlanta-ga", name: "Atlanta", state: "GA", stateName: "Georgia", nearby: ["Buckhead", "Midtown", "Downtown Atlanta", "Virginia-Highland", "Grant Park", "Old Fourth Ward", "West Midtown", "East Atlanta", "Kirkwood", "Candler Park"] },
  { slug: "roswell-ga", name: "Roswell", state: "GA", stateName: "Georgia", nearby: ["Historic Roswell", "Crabapple", "Mountain Park", "Willow Springs", "Horseshoe Bend", "East Roswell", "Martins Landing", "North Point area"] },
  { slug: "san-antonio-tx", name: "San Antonio", state: "TX", stateName: "Texas", nearby: ["Alamo Heights", "Stone Oak", "Leon Valley", "Helotes", "Shavano Park", "Castle Hills", "Converse", "Live Oak", "Universal City", "Terrell Hills", "Downtown San Antonio", "Northwest Side", "Far West Side"] }
];

const services = [
  {
    baseSlug: "garage-door-repair",
    label: "Garage Door Repair",
    primary: "garage door repair",
    titleSuffix: "Same-Day Local Help",
    h1Suffix: "Same-Day Local Help",
    secondary: ["garage door service", "garage door repair near me", "broken garage door", "garage door won't open", "garage door won't close", "garage door stuck"],
    signs: ["The door will not open or only lifts a few inches.", "The door closes then reverses without a clear obstruction.", "The door sounds louder, grinds, or shakes while moving.", "A panel is bent, the door is crooked, or rollers are slipping out of track."],
    problem: "Most repair calls start with a symptom, not a diagnosis. A local technician checks the spring tension, cable condition, opener response, tracks, rollers, hinges, and safety sensors before recommending the right repair."
  },
  {
    baseSlug: "garage-door-spring-repair",
    label: "Garage Door Spring Repair",
    primary: "garage door spring repair",
    titleSuffix: "Broken Spring Service",
    h1Suffix: "Broken Spring Service",
    secondary: ["fix garage door spring", "garage spring repair", "overhead door spring repair", "broken garage door spring repair", "fix broken garage door spring"],
    signs: ["You heard a loud bang from the garage.", "The opener runs but the door barely moves.", "The door feels extremely heavy by hand.", "There is a visible gap in the spring above the door."],
    problem: "Garage door springs carry the door's weight. When one fails, the opener is no longer doing normal work; it is trying to lift a heavy, unbalanced door.",
    safety: true
  },
  {
    baseSlug: "garage-door-torsion-spring-repair",
    label: "Garage Door Torsion Spring Repair",
    primary: "garage door torsion spring repair",
    titleSuffix: "Safe Replacement",
    h1Suffix: "Safe Replacement",
    secondary: ["garage door torsion spring broken", "replace garage door torsion spring", "broken torsion spring", "garage torsion spring repair"],
    signs: ["The spring mounted above the door has a gap.", "The door opens a few inches and stops.", "The shaft or drum looks uneven.", "The door slams down or will not stay halfway open."],
    problem: "Torsion springs are high-tension parts mounted on the bar above the door. The correct repair means matching spring size to door weight, replacing weak paired springs when needed, and rebalancing the door before the opener is used again.",
    safety: true
  },
  {
    baseSlug: "garage-door-opener-repair",
    label: "Garage Door Opener Repair",
    primary: "garage door opener repair",
    titleSuffix: "Motor, Remote & Sensor Help",
    h1Suffix: "Motor, Remote & Sensor Help",
    secondary: ["garage door opener not working", "garage door motor repair", "garage door remote not working", "garage door keypad not working", "garage door sensors not working"],
    signs: ["The wall button works but the remote does not.", "The opener hums without moving the door.", "The door closes partway then reverses.", "The keypad stopped accepting the code."],
    problem: "Opener problems can be electrical, mechanical, or safety-sensor related. A tech checks the outlet, logic board, travel limits, force settings, photo eyes, remotes, keypad, rail, belt, chain, and gear assembly."
  },
  {
    baseSlug: "emergency-garage-door-repair",
    label: "Emergency Garage Door Repair",
    primary: "emergency garage door repair",
    titleSuffix: "Fast Dispatch",
    h1Suffix: "Fast Dispatch",
    secondary: ["emergency garage door repair near me", "garage door stuck open", "garage door stuck closed", "garage door jammed", "garage door will not close"],
    signs: ["The door is stuck open and the home is exposed.", "Your car is trapped inside the garage.", "The door is jammed, crooked, or hanging from one side.", "The door will not close at night or during bad weather."],
    problem: "Emergency calls prioritize securing the opening and preventing further damage. The first goal is getting the door safely closed, opened, or stabilized; the second is completing the permanent repair when parts are available.",
    safety: true
  },
  {
    baseSlug: "off-track-garage-door-repair",
    label: "Off-Track Garage Door Repair",
    primary: "off track garage door repair",
    slugPrimary: "off-track-garage-door-repair",
    titleSuffix: "Crooked Door Help",
    h1Suffix: "Crooked Door Help",
    secondary: ["garage door came off track", "garage door crooked and stuck", "garage door track repair", "garage door bent track repair"],
    signs: ["One side of the door is higher than the other.", "A roller popped out of the track.", "The track is bent after a bumper tap.", "The door is stuck crooked and the opener strains."],
    problem: "An off-track door is usually a symptom of a cable issue, roller failure, bent track, or impact damage. The repair starts by stabilizing the door, then checking every part that caused it to leave the track.",
    safety: true
  },
  {
    baseSlug: "garage-door-cable-repair",
    label: "Garage Door Cable Repair",
    primary: "garage door cable repair",
    titleSuffix: "Snapped Cable Service",
    h1Suffix: "Snapped Cable Service",
    secondary: ["garage door cable repair near me", "broken cable on garage door", "garage door cable snapped", "garage door cable came off"],
    signs: ["A cable is hanging loose beside the door.", "The door dropped crooked or jammed on one side.", "The opener strains but the door twists.", "The cable jumped off the drum."],
    problem: "Lift cables work with the springs to raise the door evenly. When one cable frays, snaps, or jumps the drum, the door can wedge in the track and bend panels if the opener keeps running.",
    safety: true
  }
];

const navLabels = new Map([
  ["garage-door-repair", "Garage Door Repair"],
  ["garage-door-spring-repair", "Spring Repair"],
  ["garage-door-torsion-spring-repair", "Torsion Spring Repair"],
  ["garage-door-opener-repair", "Opener Repair"],
  ["emergency-garage-door-repair", "Emergency Repair"],
  ["off-track-garage-door-repair", "Off-Track Doors"],
  ["garage-door-cable-repair", "Cable Repair"]
]);

function esc(text) {
  return String(text).replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;").replaceAll('"', "&quot;");
}

function serviceSlug(service, city) {
  return `${service.slugPrimary || service.baseSlug}-${city.slug}`;
}

function titleCaseKeyword(keyword) {
  return keyword.split(" ").map((word) => word.charAt(0).toUpperCase() + word.slice(1)).join(" ");
}

function header() {
  return `<header class="site-header">
  <div class="container header-inner">
    <a href="/" class="brand" aria-label="Garage Door Repair Genie home">
      <img src="/logo.webp" srcset="/logo.webp 1x, /logo@2x.webp 2x" alt="Garage Door Repair Genie" class="brand-logo" width="180" height="64">
    </a>
    <nav class="primary-nav" aria-label="Primary">
      <ul>
        <li><a href="/">Home</a></li>
        <li class="has-dropdown">
          <a href="/garage-door-repair/">Services</a>
          <ul class="dropdown">
            ${services.map((service) => `<li><a href="/${service.baseSlug}/">${esc(navLabels.get(service.baseSlug) || service.label)}</a></li>`).join("\n            ")}
          </ul>
        </li>
        <li class="has-dropdown">
          <a href="/portland-or/">Service Areas</a>
          <ul class="dropdown">
            ${cities.map((city) => `<li><a href="/${city.slug}/">${city.name}, ${city.state}</a></li>`).join("\n            ")}
          </ul>
        </li>
        <li class="has-dropdown">
          <a href="/cost-to-replace-garage-door-spring/">Garage Door Tips</a>
          <ul class="dropdown">
            <li><a href="/cost-to-replace-garage-door-spring/">Spring Replacement Cost</a></li>
            <li><a href="/garage-door-spring-snapped/">Spring Snapped</a></li>
            <li><a href="/garage-door-wire-broke/">Garage Door Wire Broke</a></li>
          </ul>
        </li>
        <li><a href="/contact/">Contact</a></li>
      </ul>
    </nav>
    <a href="tel:${PHONE_TEL}" class="btn btn-call header-call">Call Now ${PHONE_DISPLAY}</a>
  </div>
</header>`;
}

function footer() {
  return `<footer class="site-footer">
  <div class="container footer-grid">
    <div class="footer-col">
      <strong class="footer-brand">Garage Door Repair Genie</strong>
      <p>Fast Garage Door Repair, Like Magic. We connect homeowners with local pros for spring, opener, cable, off-track, and emergency garage door work.</p>
      <a href="tel:${PHONE_TEL}" class="btn btn-call">Call ${PHONE_DISPLAY}</a>
    </div>
    <div class="footer-col">
      <h4>Services</h4>
      <ul>
        ${services.map((service) => `<li><a href="/${service.baseSlug}/">${esc(service.label)}</a></li>`).join("\n        ")}
      </ul>
    </div>
    <div class="footer-col">
      <h4>Service Areas</h4>
      <ul>
        ${cities.map((city) => `<li><a href="/${city.slug}/">${city.name}, ${city.state}</a></li>`).join("\n        ")}
      </ul>
    </div>
    <div class="footer-col">
      <h4>Garage Door Tips</h4>
      <ul>
        <li><a href="/cost-to-replace-garage-door-spring/">Spring Replacement Cost</a></li>
        <li><a href="/garage-door-spring-snapped/">Spring Snapped</a></li>
        <li><a href="/garage-door-wire-broke/">Garage Door Wire Broke</a></li>
        <li><a href="/contact/">Contact</a></li>
      </ul>
    </div>
  </div>
  <div class="container footer-bottom">
    <p class="disclaimer">Garage Door Repair Genie connects homeowners with local garage door repair service providers. Service availability may vary by location.</p>
    <p>&copy; <span id="copyright-year">2026</span> Garage Door Repair Genie. All rights reserved.</p>
  </div>
</footer>`;
}

function pageHtml(service, city) {
  const slug = serviceSlug(service, city);
  const cityName = `${city.name}, ${city.state}`;
  const primary = `${service.primary} ${city.name} ${city.state}`;
  const title = `${titleCaseKeyword(service.primary)} ${city.name} ${city.state} | ${service.titleSuffix}`;
  const h1 = `${titleCaseKeyword(service.primary)} in ${cityName}`;
  const meta = `${titleCaseKeyword(service.primary)} ${city.name} ${city.state} for ${service.secondary.slice(0, 2).join(" and ")}. Call Garage Door Repair Genie now.`;
  const canonical = `${ORIGIN}/${slug}/`;
  const nearby = city.nearby.slice(0, 8);
  const relatedServices = services.filter((item) => item.baseSlug !== service.baseSlug).slice(0, 6);
  const quickAnswer = `${titleCaseKeyword(service.primary)} in ${cityName} helps homeowners get a broken, stuck, noisy, or unsafe garage door diagnosed by a local provider. Call Garage Door Repair Genie for the fastest service window and a local estimate.`;

  const faq = [
    {
      q: `How fast can I get ${service.primary} in ${city.name}?`,
      a: `Same-day help is often available in ${city.name} when you call early. Emergency door-stuck-open and car-trapped calls are prioritized.`
    },
    {
      q: `What should I do before the technician arrives?`,
      a: service.safety ? "Stop using the opener, keep people clear of the door, and do not force the door. The counterbalance system may be compromised." : "Leave the door as-is if it is acting unpredictably. Note what the opener, remote, wall button, or door did right before the failure."
    },
    {
      q: `Do you cover neighborhoods near ${city.name}?`,
      a: `Yes. Coverage includes ${nearby.slice(0, 5).join(", ")} and nearby parts of the ${city.name} area.`
    }
  ];

  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>${esc(title)}</title>
<meta name="description" content="${esc(meta.slice(0, 158))}">
<link rel="canonical" href="${canonical}">
<meta property="og:title" content="${esc(title)}">
<meta property="og:description" content="${esc(meta.slice(0, 158))}">
<meta property="og:url" content="${canonical}">
<meta property="og:type" content="website">
<meta name="author" content="Garage Door Repair Genie">
<link rel="icon" type="image/svg+xml" href="/favicon.svg">
<link rel="stylesheet" href="/styles.css">
</head>
<body>
${header()}
<nav class="breadcrumbs container" aria-label="Breadcrumb">
  <a href="/">Home</a> <span aria-hidden="true">&gt;</span> <a href="/${city.slug}/">${cityName}</a> <span aria-hidden="true">&gt;</span> <span>${esc(service.label)}</span>
</nav>

<section class="hero hero-service">
  <div class="container">
    <p class="eyebrow">Local ${esc(service.label)}</p>
    <h1>${esc(h1)}</h1>
    <p class="hero-sub">${esc(quickAnswer)}</p>
    <div class="hero-cta">
      <a href="tel:${PHONE_TEL}" class="btn btn-call btn-lg">Call ${PHONE_DISPLAY}</a>
      <a href="#service-details" class="btn btn-secondary">See What We Fix</a>
    </div>
  </div>
</section>

<section class="quick-summary">
  <div class="container">
    <h2>Quick Answer</h2>
    <p>${esc(quickAnswer)}</p>
    <ul class="key-points">
      <li><strong>Best next step:</strong> call before forcing a damaged or stuck door</li>
      <li><strong>Local ${esc(service.label.toLowerCase())}</strong> for homeowners in ${cityName}</li>
      <li><strong>Same-day dispatch</strong> is often available when you call early</li>
      <li><strong>Common related calls:</strong> ${esc(service.secondary.slice(0, 3).join(", "))}</li>
      <li><strong>Call first</strong> for the fastest service window and a local estimate</li>
    </ul>
  </div>
</section>

<section id="service-details" class="content-block">
  <div class="container">
    <h2>${esc(titleCaseKeyword(service.secondary[0]))} in ${city.name}</h2>
    <p>${esc(service.problem)} If you are in ${cityName}, call the Genie and describe the symptom. We route the call around the actual problem, not a generic appointment script.</p>
    ${service.safety ? `<p class="callout"><strong>Safety warning:</strong> Do not force a garage door with a broken spring, snapped cable, or off-track section. Garage doors are heavy and can be dangerous when the counterbalance system fails.</p>` : ""}
  </div>
</section>

<section class="content-block">
  <div class="container">
    <h2>${esc(titleCaseKeyword(service.secondary[1] || service.secondary[0]))}</h2>
    <p>These are the signs that point to a real service call instead of a quick reset:</p>
    <ul>
      ${service.signs.map((sign) => `<li>${esc(sign)}</li>`).join("\n      ")}
    </ul>
  </div>
</section>

<section class="content-block">
  <div class="container">
    <h2>${esc(titleCaseKeyword(service.secondary[2] || service.primary))}</h2>
    <p>Local providers cover ${nearby.join(", ")} and nearby areas. If your neighborhood is not listed, call anyway; availability can change by technician location and time of day.</p>
    <div class="areas-grid">
      ${nearby.map((area) => `<span class="area-card"><strong>${esc(area)}</strong><span>${esc(service.label)} coverage near ${city.name}</span></span>`).join("\n      ")}
    </div>
  </div>
</section>

<section class="service-areas">
  <div class="container">
    <h2>Related Garage Door Services in ${city.name}</h2>
    <p class="section-intro">Each page owns a separate service keyword cluster for ${cityName}, which keeps the site focused and reduces cannibalization.</p>
    <div class="areas-grid">
      ${relatedServices.map((item) => `<a class="area-card" href="/${serviceSlug(item, city)}/"><strong>${esc(item.label)} ${city.name} ${city.state}</strong><span>${esc(item.secondary.slice(0, 2).join(" / "))}</span></a>`).join("\n      ")}
    </div>
  </div>
</section>

<section class="faq">
  <div class="container">
    <h2>${esc(service.label)} ${city.name} FAQ</h2>
    ${faq.map((item) => `<details>
      <summary>${esc(item.q)}</summary>
      <p>${esc(item.a)}</p>
    </details>`).join("\n    ")}
  </div>
</section>

<script type="application/ld+json">
${JSON.stringify({
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  "name": `Garage Door Repair Genie - ${service.label} ${city.name}, ${city.state}`,
  "image": `${ORIGIN}/logo.webp`,
  "@id": canonical,
  "url": canonical,
  "telephone": PHONE_TEL,
  "priceRange": "$$",
  "address": {
    "@type": "PostalAddress",
    "addressLocality": city.name,
    "addressRegion": city.state,
    "addressCountry": "US"
  },
  "areaServed": [{ "@type": "City", "name": cityName }, ...nearby.map((area) => ({ "@type": "Place", "name": area }))],
  "makesOffer": { "@type": "Offer", "itemOffered": { "@type": "Service", "name": `${service.label} in ${cityName}` } }
}, null, 2)}
</script>
<script type="application/ld+json">
${JSON.stringify({
  "@context": "https://schema.org",
  "@type": "Service",
  "name": `${service.label} ${city.name} ${city.state}`,
  "provider": { "@type": "Organization", "name": "Garage Door Repair Genie", "url": ORIGIN, "telephone": PHONE_TEL },
  "serviceType": service.label,
  "areaServed": cityName,
  "url": canonical
}, null, 2)}
</script>
<script type="application/ld+json">
${JSON.stringify({
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": faq.map((item) => ({
    "@type": "Question",
    "name": item.q,
    "acceptedAnswer": { "@type": "Answer", "text": item.a }
  }))
}, null, 2)}
</script>
<script type="application/ld+json">
${JSON.stringify({
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  "itemListElement": [
    { "@type": "ListItem", "position": 1, "name": "Home", "item": `${ORIGIN}/` },
    { "@type": "ListItem", "position": 2, "name": cityName, "item": `${ORIGIN}/${city.slug}/` },
    { "@type": "ListItem", "position": 3, "name": service.label, "item": canonical }
  ]
}, null, 2)}
</script>

<section class="final-cta">
  <div class="container">
    <h2>Call the Genie for ${esc(service.label)} in ${city.name}</h2>
    <p>Garage door problem? Let's make it disappear. Call now for the fastest path to local help.</p>
    <a href="tel:${PHONE_TEL}" class="btn btn-call btn-lg">Call ${PHONE_DISPLAY}</a>
  </div>
</section>

${footer()}
<a href="tel:${PHONE_TEL}" class="sticky-cta" aria-label="Call Garage Door Repair Genie">Call Garage Door Repair Genie</a>
<script src="/main.js" defer></script>
</body>
</html>`;
}

function cityServiceLinks(city) {
  return `<section class="content-block city-service-links" data-generated="city-service-links">
  <div class="container">
    <h2>Service Pages for ${city.name}, ${city.state}</h2>
    <p>These focused pages map each local service keyword to one URL.</p>
    <div class="areas-grid">
      ${services.map((service) => `<a class="area-card" href="/${serviceSlug(service, city)}/"><strong>${esc(service.label)} ${city.name} ${city.state}</strong><span>${esc(service.secondary.slice(0, 2).join(" / "))}</span></a>`).join("\n      ")}
    </div>
  </div>
</section>

`;
}

function serviceCityLinks(service) {
  return `<section class="service-areas city-service-links" data-generated="service-city-links">
  <div class="container">
    <h2>${esc(service.label)} by City</h2>
    <p class="section-intro">These city pages own the exact local ${esc(service.primary)} keyword cluster for each market.</p>
    <div class="areas-grid">
      ${cities.map((city) => `<a class="area-card" href="/${serviceSlug(service, city)}/"><strong>${esc(service.label)} ${city.name} ${city.state}</strong><span>${esc(city.nearby.slice(0, 3).join(" / "))}</span></a>`).join("\n      ")}
    </div>
  </div>
</section>

`;
}

function injectOnce(filePath, marker, html, beforePattern) {
  let source = readFileSync(filePath, "utf8");
  const startPattern = new RegExp(`<section[^>]+data-generated="${marker}"[\\s\\S]*?</section>\\s*`, "m");
  source = source.replace(startPattern, "");
  const target = source.match(beforePattern);
  if (!target) return;
  source = source.slice(0, target.index) + html + source.slice(target.index);
  writeFileSync(filePath, source);
}

function sitemapUrls() {
  const base = [
    "",
    "garage-door-repair",
    "garage-door-spring-repair",
    "garage-door-torsion-spring-repair",
    "cost-to-replace-garage-door-spring",
    "garage-door-spring-snapped",
    "garage-door-opener-repair",
    "emergency-garage-door-repair",
    "off-track-garage-door-repair",
    "garage-door-cable-repair",
    "garage-door-wire-broke",
    ...cities.map((city) => city.slug),
    "contact"
  ];
  const cityService = cities.flatMap((city) => services.map((service) => serviceSlug(service, city)));
  return [...base, ...cityService];
}

function writeKeywordMap() {
  const rows = [];
  rows.push("# Garage Door Repair Genie Keyword Map");
  rows.push("");
  rows.push("This map follows the 2026 SOP: one page owns one keyword cluster, the highest-intent keyword gets the title/H1/slug, and secondary terms become H2/body/FAQ topics.");
  rows.push("");
  rows.push("## Competitor SERP Pattern");
  rows.push("");
  rows.push("- Portland results show city-root pages using `Portland Garage Door Repair`, emergency repair, openers, spring replacement, and repair/install services.");
  rows.push("- Atlanta and San Antonio results show the same structure: local root repair pages plus service blocks for springs, openers, cables, off-track doors, installation, same-day, and emergency calls.");
  rows.push("- The build response is a flat city-service layer so `garage door spring repair atlanta ga` does not have to rank from a generic spring page or a generic Atlanta page.");
  rows.push("");
  rows.push("## Core Hubs");
  rows.push("");
  rows.push("| URL | Primary Cluster | Role |");
  rows.push("| --- | --- | --- |");
  rows.push("| `/` | garage door repair genie, fast garage door repair | Brand/homepage conversion hub |");
  rows.push("| `/garage-door-repair/` | garage door repair, garage door service, broken garage door | National/service hub |");
  rows.push("| `/garage-door-spring-repair/` | garage door spring repair, fix garage door spring, broken garage door spring repair | Service hub |");
  rows.push("| `/garage-door-torsion-spring-repair/` | garage door torsion spring repair, broken torsion spring | Service hub |");
  rows.push("| `/garage-door-opener-repair/` | garage door opener repair, opener not working, remote/keypad/sensor issues | Service hub |");
  rows.push("| `/emergency-garage-door-repair/` | emergency garage door repair, stuck open, stuck closed, jammed door | Service hub |");
  rows.push("| `/off-track-garage-door-repair/` | off track garage door repair, came off track, bent track repair | Service hub |");
  rows.push("| `/garage-door-cable-repair/` | garage door cable repair, cable snapped, cable came off | Service hub |");
  rows.push("");
  rows.push("## City-Service Pages");
  rows.push("");
  rows.push("| URL | Title/H1 Primary Keyword | Secondary H2 Keywords |");
  rows.push("| --- | --- | --- |");
  for (const city of cities) {
    for (const service of services) {
      rows.push(`| \`/${serviceSlug(service, city)}/\` | ${service.primary} ${city.name} ${city.state} | ${service.secondary.join("; ")} |`);
    }
  }
  rows.push("");
  rows.push("## Cannibalization Rules");
  rows.push("");
  rows.push("- Generic service hubs do not target a city in the title tag.");
  rows.push("- City hubs own `garage door repair in [city]` GBP/location intent and link to city-service pages.");
  rows.push("- City-service pages own exact `service + city + state` transactional queries.");
  rows.push("- Tip pages stay informational and should not reuse city-service title tags.");
  writeFileSync("KEYWORD_MAP.md", rows.join("\n"));
}

mkdirSync(PAGES_DIR, { recursive: true });

for (const city of cities) {
  for (const service of services) {
    const slug = serviceSlug(service, city);
    writeFileSync(join(PAGES_DIR, `${slug}.html`), pageHtml(service, city));
  }
  injectOnce(join(PAGES_DIR, `${city.slug}.html`), "city-service-links", cityServiceLinks(city), /<section class="faq">/);
}

for (const service of services) {
  injectOnce(join(PAGES_DIR, `${service.baseSlug}.html`), "service-city-links", serviceCityLinks(service), /<!-- ======= FAQ ======= -->|<section class="faq">/);
}

const sitemap = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${sitemapUrls().map((slug) => `  <url><loc>${ORIGIN}/${slug ? `${slug}/` : ""}</loc></url>`).join("\n")}\n</urlset>\n`;
writeFileSync("public/sitemap.xml", sitemap);
writeKeywordMap();

console.log(`Generated ${cities.length * services.length} city-service pages, sitemap.xml, and KEYWORD_MAP.md.`);
