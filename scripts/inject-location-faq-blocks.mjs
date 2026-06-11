import { readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const PAGES_DIR = "public/pages";

const cities = [
  { slug: "garage-door-repair-portland-or", name: "Portland", state: "OR", nearby: "Pearl District, Sellwood-Moreland, Hawthorne, St. Johns, and Laurelhurst" },
  { slug: "garage-door-repair-vancouver-wa", name: "Vancouver", state: "WA", nearby: "Hazel Dell, Salmon Creek, Felida, Cascade Park, and Downtown Vancouver" },
  { slug: "garage-door-repair-savannah-ga", name: "Savannah", state: "GA", nearby: "Downtown Savannah, Midtown, Ardsley Park, Southside, Pooler, and Isle of Hope" },
  { slug: "garage-door-repair-marietta-ga", name: "Marietta", state: "GA", nearby: "East Cobb, West Cobb, Whitlock, Sandy Plains, and the Kennesaw Mountain area" },
  { slug: "garage-door-repair-atlanta-ga", name: "Atlanta", state: "GA", nearby: "Buckhead, Midtown, Downtown Atlanta, Virginia-Highland, Grant Park, and Old Fourth Ward" },
  { slug: "garage-door-repair-roswell-ga", name: "Roswell", state: "GA", nearby: "Historic Roswell, Crabapple, Mountain Park, Willow Springs, and East Roswell" },
  { slug: "garage-door-repair-san-antonio-tx", name: "San Antonio", state: "TX", nearby: "Alamo Heights, Stone Oak, Helotes, Castle Hills, Downtown San Antonio, and the Far West Side" }
];

function block(city) {
  return `<section class="content-block location-answer-blocks" data-generated="location-answer-blocks">
  <div class="container">
    <h2>Quick Garage Door Answers for ${city.name}, ${city.state}</h2>
    <div class="cards">
      <div class="card">
        <h3>How much does garage door repair cost in ${city.name}?</h3>
        <p>Garage door repair in ${city.name} usually depends on the failed part, door size, urgency, and local labor rates. Simple fixes can be lower, while springs, cables, openers, and off-track doors cost more. Call for a local estimate.</p>
      </div>
      <div class="card">
        <h3>Who fixes broken garage door springs in ${city.name}?</h3>
        <p>Garage Door Repair Genie provides broken spring repair in ${city.name}. Do not force the door if the spring snapped or the door feels too heavy to lift.</p>
      </div>
      <div class="card">
        <h3>Can I get emergency garage door repair in ${city.name}?</h3>
        <p>Emergency garage door repair is most important when the door is stuck open, stuck closed, off track, or unsafe. Same-day dispatch is often available when you call early.</p>
      </div>
      <div class="card">
        <h3>What areas near ${city.name} are covered?</h3>
        <p>Local service coverage includes ${city.nearby}. Availability may vary by technician location, time of day, and service type.</p>
      </div>
    </div>
  </div>
</section>

`;
}

for (const city of cities) {
  const path = join(PAGES_DIR, `${city.slug}.html`);
  let source = readFileSync(path, "utf8");
  source = source.replace(/<section class="content-block location-answer-blocks" data-generated="location-answer-blocks">[\s\S]*?<\/section>\s*/m, "");
  source = source.replace(/<section class="content-block city-service-links"/, `${block(city)}<section class="content-block city-service-links"`);
  writeFileSync(path, source);
}

console.log(`Injected location answer blocks for ${cities.length} city pages.`);
