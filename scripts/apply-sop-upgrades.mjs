import { readdirSync, readFileSync, writeFileSync } from "node:fs";

const PAGES_DIR = "public/pages";

const priorityBlocks = new Map([
  ["garage-door-repair-san-antonio-tx.html", {
    heading: "Which San Antonio Repair Fits?",
    body: [
      "If the door works in the morning but reverses during afternoon heat, choose opener force and track-friction diagnosis before replacing the motor. If the door feels heavy by hand, choose spring or cable diagnosis first. The trade-off is accuracy: heat can imitate opener failure, but a weak counterbalance will keep damaging any opener attached to it.",
      "San Antonio homes around Stone Oak, Alamo Heights, Helotes, and Castle Hills see heat-expanded tracks, dried roller lubricant, and spring fatigue show up during long 100-degree stretches.",
      "Lubrication cadence matters when metal parts heat-cycle daily. A six-month tune-up matters more here than in mild climates because dry rollers make the opener work harder.",
      "A typical heat tune-up takes about 30 to 45 minutes; spring, cable, or opener repairs often need a longer 60- to 90-minute service window once the failed part is confirmed."
    ]
  }],
  ["garage-door-repair-marietta-ga.html", {
    heading: "Which Marietta Repair Fits?",
    body: [
      "If one older door failed in a two- or three-car garage, choose a full multi-door inspection instead of fixing only the loudest symptom. If the door only refuses to close during pollen season, choose sensor cleaning and alignment first. The trade-off is timing: grouped inspection costs less than repeated visits, but a sensor issue should not be sold as a spring repair.",
      "Marietta homes around East Cobb, West Cobb, Whitlock, and Sandy Plains often sit in the 15- to 25-year window where original springs and chain-drive openers fail together.",
      "Spring cycle rating matters for primary-entrance garages because the door may run four or more times a day. Sensor lens condition matters during yellow pine pollen because the beam can fail without a mechanical problem.",
      "A multi-door inspection can check two or three doors on one stop; replacing a weak spring before it snaps can prevent a second emergency call weeks later."
    ]
  }],
  ["garage-door-repair.html", {
    heading: "Which Garage Door Repair Fits?",
    body: [
      "If the door is heavy by hand, choose spring or cable repair before opener replacement. If the door moves easily by hand but fails from the wall button, choose opener or sensor repair. The trade-off is cost: a quick reset is cheaper, but forcing a door with failed counterbalance parts can bend panels and turn one repair into several.",
      "The visible symptom matters: a loud bang points to a spring, a crooked door points to a cable or track, and a six-inch reversal often points to sensors or force settings.",
      "Manual balance testing matters when the opener strains because the opener should guide the door, not lift its full 250- to 400-pound weight.",
      "Most diagnosis takes 10 to 15 minutes, while common spring, cable, sensor, and opener repairs usually fit a 60- to 90-minute service window."
    ]
  }],
  ["garage-door-spring-repair.html", {
    heading: "Which Spring Repair Fits?",
    body: [
      "If the spring above the door has a visible gap, choose torsion spring replacement. If the springs run along the horizontal tracks, choose extension spring service. The trade-off is matching: the right spring costs more than a generic swap, but it keeps the door balanced and protects the opener.",
      "A broken spring usually announces itself with one sharp bang, then the door feels too heavy to lift or opens only a few inches.",
      "Cycle rating matters when the garage is the main entrance. A standard 10,000-cycle spring fits light use, while 15,000- to 20,000-cycle options fit heavier daily traffic.",
      "A balanced door should stay near halfway open during a manual lift test; if it drops or shoots upward, the spring setup still needs adjustment."
    ]
  }],
  ["emergency-garage-door-repair.html", {
    heading: "Which Emergency Repair Fits?",
    body: [
      "If the door is stuck open, choose emergency repair because the home is exposed. If the door is stuck closed with a car trapped inside, tell dispatch access is the priority. The trade-off is speed versus completeness: the first goal is securing or opening the door safely, then completing the permanent repair.",
      "Emergency calls usually involve a stuck-open door, a trapped vehicle, a crooked off-track door, or a door that will not close at night.",
      "Temporary stabilization matters when a panel is hanging or a cable has jumped the drum because running the opener can bend sections that were still repairable.",
      "The first safe outcome may take less time than the final repair; spring, cable, and track repairs commonly need a 60- to 90-minute window after diagnosis."
    ]
  }]
]);

function addMicrodata(html) {
  let next = html;
  next = next.replace(/<body(?![^>]*itemscope)([^>]*)>/i, '<body$1 itemscope itemtype="https://schema.org/WebPage">');
  next = next.replace(/<link itemprop="url" rel="canonical" href="([^"]+)">/gi, '<link rel="canonical" href="$1" itemprop="url">');
  next = next.replace(/<link rel="canonical" itemprop="url" href="([^"]+)">/gi, '<link rel="canonical" href="$1" itemprop="url">');
  next = next.replace(/<link rel="canonical" href="([^"]+)"(?![^>]*itemprop=)>/i, '<link rel="canonical" href="$1" itemprop="url">');
  next = next.replace(/<h1(?![^>]*itemprop=)([^>]*)>/i, '<h1$1 itemprop="name">');
  next = next.replace(/<p class="hero-sub"(?![^>]*itemprop=)([^>]*)>/i, '<p class="hero-sub"$1 itemprop="description">');
  next = next.replace(/<a href="tel:([^"]+)"(?![^>]*itemprop=)/g, '<a href="tel:$1" itemprop="telephone"');
  return next;
}

function upsertPriorityBlock(html, block) {
  let next = html.replace(/<section class="content-block sop-fit" data-generated="sop-upgrade"[\s\S]*?<\/section>\s*/m, "");
  const section = `<section class="content-block sop-fit" data-generated="sop-upgrade" itemscope itemtype="https://schema.org/Service">
  <div class="container">
    <h2>${block.heading}</h2>
    ${block.body.map((paragraph, index) => `<p${index === 0 ? ' itemprop="serviceType"' : ""}>${paragraph}</p>`).join("\n    ")}
  </div>
</section>

`;
  const target = next.match(/<section class="faq">|<!-- ======= FAQ ======= -->/);
  if (!target) return next;
  return next.slice(0, target.index) + section + next.slice(target.index);
}

for (const file of readdirSync(PAGES_DIR).filter((name) => name.endsWith(".html"))) {
  const path = `${PAGES_DIR}/${file}`;
  let html = readFileSync(path, "utf8");
  html = addMicrodata(html);
  if (priorityBlocks.has(file)) {
    html = upsertPriorityBlock(html, priorityBlocks.get(file));
  }
  writeFileSync(path, html);
}

console.log("Applied SOP microdata and priority content upgrades.");
