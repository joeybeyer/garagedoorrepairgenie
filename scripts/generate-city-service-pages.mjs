import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const ORIGIN = "https://garagedoorrepairgenie.com";
const DEFAULT_PHONE_DISPLAY = "(833) 602-3065";
const DEFAULT_PHONE_TEL = "+18336023065";
const PAGES_DIR = "public/pages";

const cities = [
  { slug: "portland-or", name: "Portland", state: "OR", stateName: "Oregon", phoneDisplay: "(971) 342-6751", phoneTel: "+19713426751", streetAddress: "909 SW 5th Ave", postalCode: "97204", mapEmbedSrc: "https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d265000.2109709155!2d-122.6543856!3d45.5427145!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x549571c606e23221%3A0x60cb4031e3ccc65c!2sGarage%20Door&#39;s%20Repair%20Genie!5e1!3m2!1sen!2sus!4v1781214074406!5m2!1sen!2sus", nearby: ["Pearl District", "Sellwood-Moreland", "Alberta Arts District", "Hawthorne", "St. Johns", "Laurelhurst", "Northwest Portland", "Southeast Portland", "Northeast Portland"] },
  { slug: "vancouver-wa", name: "Vancouver", state: "WA", stateName: "Washington", phoneDisplay: "(564) 227-2578", phoneTel: "+15642272578", streetAddress: "316 W 8th St", postalCode: "98660", mapEmbedSrc: "https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d4151.888850236325!2d-122.2415768!3d45.3896204!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x5495855e5061531d%3A0x57ce2471f8294b60!2sGarage%20Door&#39;s%20Repair%20Genie!5e1!3m2!1sen!2sus!4v1781214816432!5m2!1sen!2sus", nearby: ["Hazel Dell", "Salmon Creek", "Felida", "Orchards", "Cascade Park", "Fishers Landing", "Downtown Vancouver", "Minnehaha", "Walnut Grove"] },
  { slug: "savannah-ga", name: "Savannah", state: "GA", stateName: "Georgia", phoneDisplay: "(912) 450-6093", phoneTel: "+19124506093", streetAddress: "423 Bull St", postalCode: "31401", nearby: ["Downtown Savannah", "Midtown", "Ardsley Park", "Southside", "Georgetown", "Pooler", "Garden City", "Thunderbolt", "Isle of Hope", "Skidaway Island"] },
  { slug: "marietta-ga", name: "Marietta", state: "GA", stateName: "Georgia", phoneDisplay: "(678) 740-5268", phoneTel: "+16787405268", streetAddress: "115 Anderson St SE", postalCode: "30060", nearby: ["East Cobb", "West Cobb", "Fair Oaks", "Powers Park", "Whitlock", "Sandy Plains", "Kennesaw Mountain area", "Elizabeth", "Blackwell"] },
  { slug: "atlanta-ga", name: "Atlanta", state: "GA", stateName: "Georgia", phoneDisplay: "(943) 219-1797", phoneTel: "+19432191797", streetAddress: "165 Forsyth St SW", postalCode: "30303", mapEmbedSrc: "https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d4915.648934760804!2d-84.3959114!3d33.7499378!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x88f5ebd4cfa82415%3A0xd37e57bd7031df43!2sGarage%20Door&#39;s%20Repair%20Genie!5e1!3m2!1sen!2sus!4v1781214022319!5m2!1sen!2sus", nearby: ["Buckhead", "Midtown", "Downtown Atlanta", "Virginia-Highland", "Grant Park", "Old Fourth Ward", "West Midtown", "East Atlanta", "Kirkwood", "Candler Park"] },
  { slug: "roswell-ga", name: "Roswell", state: "GA", stateName: "Georgia", phoneDisplay: "(470) 804-7354", phoneTel: "+14708047354", streetAddress: "15 Webb St", postalCode: "30075", mapEmbedSrc: "https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d4907.282597847531!2d-84.7757378!3d33.8956046!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x88f531e4efd7f09d%3A0xb86415dbaf0d4c5!2sGarage%20Door&#39;s%20Repair%20Genie!5e1!3m2!1sen!2sus!4v1781214855327!5m2!1sen!2sus", nearby: ["Historic Roswell", "Crabapple", "Mountain Park", "Willow Springs", "Horseshoe Bend", "East Roswell", "Martins Landing", "North Point area"] },
  { slug: "san-antonio-tx", name: "San Antonio", state: "TX", stateName: "Texas", phoneDisplay: "(512) 601-6037", phoneTel: "+15126016037", streetAddress: "323 E Commerce St", postalCode: "78205", nearby: ["Alamo Heights", "Stone Oak", "Leon Valley", "Helotes", "Shavano Park", "Castle Hills", "Converse", "Live Oak", "Universal City", "Terrell Hills", "Downtown San Antonio", "Northwest Side", "Far West Side"] }
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

const topTips = [
  { href: "/what-to-do-if-garage-door-spring-breaks/", label: "Spring Breaks" },
  { href: "/how-to-know-if-garage-door-spring-is-broken/", label: "Broken Spring Signs" },
  { href: "/why-is-my-garage-door-stuck-open/", label: "Door Stuck Open" },
  { href: "/why-is-my-garage-door-stuck-closed/", label: "Door Stuck Closed" },
  { href: "/how-much-does-garage-door-repair-cost/", label: "Repair Cost" }
];

const paaSlugs = [
  "how-much-does-garage-door-repair-cost",
  "what-to-do-if-garage-door-spring-breaks",
  "how-to-know-if-garage-door-spring-is-broken",
  "why-is-my-garage-door-stuck-open",
  "why-is-my-garage-door-stuck-closed",
  "why-is-my-garage-door-opener-not-working",
  "why-did-my-garage-door-cable-snap",
  "what-is-the-wire-on-my-garage-door-called",
  "why-did-my-garage-door-come-off-track"
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

function cityLandingSlug(city) {
  return `garage-door-repair-${city.slug}`;
}

function servicePageSlug(service, city) {
  return service.baseSlug === "garage-door-repair" ? cityLandingSlug(city) : serviceSlug(service, city);
}

function titleCaseKeyword(keyword) {
  return keyword.split(" ").map((word) => word.charAt(0).toUpperCase() + word.slice(1)).join(" ");
}

function imageForService(service) {
  if (service.baseSlug.includes("emergency")) return "emergency-garage-door-repair.webp";
  if (service.baseSlug.includes("opener")) return "garage-door-opener-repair.webp";
  if (service.baseSlug.includes("cable")) return "garage-door-cable-repair.webp";
  if (service.baseSlug.includes("off-track")) return "off-track-garage-door-repair.webp";
  if (service.baseSlug.includes("spring")) return "garage-door-spring-repair.webp";
  return "garage-door-repair-service.webp";
}

function phoneDisplay(city) {
  return city?.phoneDisplay || DEFAULT_PHONE_DISPLAY;
}

function phoneTel(city) {
  return city?.phoneTel || DEFAULT_PHONE_TEL;
}

function fullAddress(city) {
  return `${city.streetAddress}, ${city.name}, ${city.state} ${city.postalCode}`;
}

function cityLocalMap(city) {
  if (!city.mapEmbedSrc) return "";
  return `<section class="content-block city-local-map" data-generated="city-local-map">
  <div class="container">
    <div class="local-map">
      <iframe src="${city.mapEmbedSrc}" width="600" height="450" style="border:0;" allowfullscreen="" loading="lazy" referrerpolicy="no-referrer-when-downgrade" title="Garage Door Repair Genie ${esc(city.name)} map"></iframe>
    </div>
  </div>
</section>

`;
}

function cityObservedDetail(city) {
  const details = {
    "portland-or": "Portland service calls often cluster around wet-season noise and sensor trouble because tracked-in grit and damp rollers make small alignment problems show up as full door failures.",
    "vancouver-wa": "Vancouver homes near the river and older downtown blocks often show damp-weather roller noise first, while Salmon Creek and Felida calls skew toward newer multi-door garages with opener calibration drift.",
    "savannah-ga": "Savannah humidity makes cable and roller wear show earlier than it does inland; calls from Midtown and Ardsley Park often involve older detached garages where corrosion is easier to spot.",
    "marietta-ga": "Marietta's 1990s and 2000s subdivisions create a steady wave of original spring and opener failures, especially around East Cobb, West Cobb, Whitlock, and Sandy Plains homes.",
    "atlanta-ga": "Atlanta calls split between older intown doors around Midtown and Grant Park and larger suburban doors around Buckhead, so dispatch has to separate sensor issues from true counterbalance failures.",
    "roswell-ga": "Roswell homes around Historic Roswell, Crabapple, and Horseshoe Bend often have heavier insulated doors, which makes weak springs and opener strain show up before the door fully stops.",
    "san-antonio-tx": "San Antonio heat expands metal tracks and dries lubricant quickly, so a door that moves normally in the morning can reverse or grind during a 100-degree afternoon."
  };
  return details[city.slug] || `${city.name} garage door calls vary by housing age, weather, and door weight, so the first useful step is matching the visible symptom to the part most likely to fail.`;
}

function serviceDecisionFit(service) {
  const fits = {
    "garage-door-spring-repair": "If the door feels extremely heavy or you heard a bang, choose spring repair first. If the opener hums but the door barely moves, still treat the spring as the lead suspect before replacing the motor. The trade-off is safety: spring work costs more than a reset, but it prevents a damaged opener from lifting an unbalanced door.",
    "garage-door-torsion-spring-repair": "If the gap is in the spring above the door, choose torsion spring repair. If the springs run along the horizontal tracks, ask about extension spring service instead. The trade-off is precision: torsion springs must be matched to door weight, while a generic spring can leave the door unsafe or hard to balance.",
    "garage-door-opener-repair": "If the door moves smoothly by hand but fails from the wall button, choose opener repair. If the door is heavy by hand, choose spring or cable diagnosis before replacing the motor. The trade-off is cost control: a sensor or gear repair can be cheaper than a new opener, but a strained opener should not mask a counterbalance problem.",
    "emergency-garage-door-repair": "If the door is stuck open, choose emergency repair because the home is exposed. If the door is stuck closed with a car trapped inside, choose the same priority but tell dispatch the access problem first. The trade-off is speed versus completeness: the first visit may secure the opening before finishing parts-heavy repairs.",
    "off-track-garage-door-repair": "If one side sits higher or a roller has left the track, choose off-track repair and stop using the opener. If the track is only noisy but straight, a roller or hinge repair may fit better. The trade-off is damage prevention: early track work protects panels that can bend when the door keeps twisting.",
    "garage-door-cable-repair": "If a cable hangs loose or the door dropped crooked, choose cable repair. If both cables look tight but the door is heavy, ask for spring diagnosis instead. The trade-off is pairing: replacing both lift cables usually costs more than one cable, but it keeps the door lifting evenly."
  };
  return fits[service.baseSlug] || "If the door will not open, will not close, or moves crooked, choose a diagnostic repair visit. If the door is only noisy but balanced, a tune-up may fit better. The trade-off is urgency: a stuck or crooked door needs faster help than routine roller noise.";
}

function serviceUseCaseBinding(service) {
  const bindings = {
    "garage-door-spring-repair": "Spring cycle rating matters when the garage is the main entrance. A 10,000-cycle spring may be enough for light use, while 15,000- to 20,000-cycle springs make more sense when the door opens four or more times a day.",
    "garage-door-torsion-spring-repair": "Wire size and spring length matter for door balance because the opener should guide the door, not lift the full weight. Correct sizing matters most on double doors and insulated doors.",
    "garage-door-opener-repair": "Force settings matter when heat, cold, or track drag changes resistance. Sensor alignment matters when the door starts down and reverses before touching the floor.",
    "emergency-garage-door-repair": "Temporary stabilization matters when the opening is exposed or the door is hanging crooked. Permanent parts replacement matters once the door is safe enough to inspect.",
    "off-track-garage-door-repair": "Track alignment matters when rollers bind or pop out. Panel inspection matters when the door has twisted because hidden bends can make the same failure return.",
    "garage-door-cable-repair": "Cable diameter and drum seating matter when the door lifts unevenly. Pair replacement matters when one cable snapped because the other cable usually carried the same cycle load."
  };
  return bindings[service.baseSlug] || "Balance testing matters when the opener strains, and sensor testing matters when the door reverses. The right repair depends on which part fails under load.";
}

function serviceQuantifiedComparison(service) {
  const comparisons = {
    "garage-door-spring-repair": "For most homes, basic torsion spring replacement is a same-visit repair; high-cycle upgrades commonly target 15,000 to 20,000 cycles instead of the roughly 10,000 cycles used by many standard springs.",
    "garage-door-torsion-spring-repair": "A balanced door should stay near halfway open during a manual lift test. If it drops fast or shoots upward, the torsion spring sizing or winding count is off and the opener will wear faster.",
    "garage-door-opener-repair": "Simple remote, keypad, and sensor fixes can take minutes; gear, rail, or logic-board diagnosis often takes 30 to 60 minutes before the repair path is clear.",
    "emergency-garage-door-repair": "Emergency calls prioritize the first safe outcome: secure a stuck-open door, release a trapped vehicle, or stabilize a crooked door before a full 60- to 90-minute repair starts.",
    "off-track-garage-door-repair": "A door that is one roller out of track is usually simpler than a door twisted across multiple panels. The longer the opener runs against the twist, the more likely panel replacement enters the estimate.",
    "garage-door-cable-repair": "Cable repairs are normally quoted as a pair because both sides carry the same door weight. Replacing one cable can leave the older side as the next failure point."
  };
  return comparisons[service.baseSlug] || "Most service visits separate quick adjustments from part replacement during the first 10 to 15 minutes of diagnosis, then quote the repair before work begins.";
}

function serviceHumanIntro(service, city) {
  const cityName = `${city.name}, ${city.state}`;
  const intros = {
    "garage-door-spring-repair": `You usually don't forget the sound of a spring letting go. In ${cityName}, we hear it described the same way over and over: one sharp bang, then a door that suddenly feels like it gained 200 pounds. If that happened at your house, don't muscle it up. Tell us whether the spring gap is above the door or along the side track, and we'll point the call in the right direction.`,
    "garage-door-torsion-spring-repair": `If you're staring at the bar above the door and wondering whether that gap in the spring is normal, it isn't. Around ${cityName}, torsion spring calls usually start with a door that opens a few inches and quits. The slightly annoying part? The opener often gets blamed first, even though the spring is doing the heavy lifting.`,
    "garage-door-opener-repair": `Opener problems can make you feel like the door is messing with you. One minute the wall button works, then the remote doesn't, then the door drops six inches and reverses. In ${cityName}, the fix depends on whether the door moves smoothly by hand. That detail saves you from buying a motor when all you needed was a sensor, gear, or force-setting repair.`,
    "emergency-garage-door-repair": `A stuck garage door never picks a polite time. If your door is open to the street in ${cityName}, or your car is trapped behind it, the first job is simple: make the opening safe. The permanent repair comes next. That's not fancy advice, but it's the difference between a stressful call and a worse one.`,
    "off-track-garage-door-repair": `A crooked garage door looks tempting to nudge back into place. Please don't. In ${cityName}, the worst off-track repairs usually started as one more button press after the first roller popped out. If one side is higher than the other, stop there and tell us what you see.`,
    "garage-door-cable-repair": `A loose cable hanging beside the door is one of those problems that looks smaller than it is. In ${cityName}, cable calls often start with the door dropping crooked or the opener sounding strained. If that's what you're seeing, don't run another cycle. The next one can bend a panel.`
  };
  return intros[service.baseSlug] || `If your garage door is acting weird in ${cityName}, you don't need to diagnose it perfectly before calling. Tell us what you saw, what you heard, and whether the door feels heavy by hand. Those three details usually narrow the repair fast.`;
}

function serviceHumanNote(service, city) {
  const nearby = city.nearby.slice(0, 3).join(", ");
  return `A small thing homeowners miss: the first symptom is usually the most useful one. Did the door bang, drift crooked, reverse, grind, or just sit there humming? If you can describe that part, plus whether you're near ${nearby}, dispatch has a much better shot at sending the right tech with the right parts. It sounds simple, but it saves a lot of back-and-forth.`;
}

function header(city) {
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
          <a href="/${cityLandingSlug(cities[0])}/">Service Areas</a>
          <ul class="dropdown">
            ${cities.map((city) => `<li><a href="/${cityLandingSlug(city)}/">${city.name}, ${city.state}</a></li>`).join("\n            ")}
          </ul>
        </li>
        <li class="has-dropdown">
          <a href="/cost-to-replace-garage-door-spring/">Garage Door Tips</a>
          <ul class="dropdown">
            ${topTips.map((item) => `<li><a href="${item.href}">${esc(item.label)}</a></li>`).join("\n            ")}
          </ul>
        </li>
        <li><a href="/contact/">Contact</a></li>
      </ul>
    </nav>
    <a href="tel:${phoneTel(city)}" class="btn btn-call header-call">Call Now ${phoneDisplay(city)}</a>
  </div>
</header>`;
}

function footer(city) {
  return `<footer class="site-footer">
  <div class="container footer-grid">
    <div class="footer-col">
      <span class="footer-brand">Garage Door Repair Genie</span>
      <p>Fast Garage Door Repair, Like Magic. We connect homeowners with local pros for spring, opener, cable, off-track, and emergency garage door work.</p>
      <a href="tel:${phoneTel(city)}" class="btn btn-call">Call ${phoneDisplay(city)}</a>
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
        ${cities.map((city) => `<li><a href="/${cityLandingSlug(city)}/">${city.name}, ${city.state}</a></li>`).join("\n        ")}
      </ul>
    </div>
    <div class="footer-col">
      <h4>Garage Door Tips</h4>
      <ul>
        ${topTips.map((item) => `<li><a href="${item.href}">${esc(item.label)}</a></li>`).join("\n        ")}
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
  const heroImage = `/images/branded/${imageForService(service)}`;
  const nearby = city.nearby.slice(0, 8);
  const relatedServices = services.filter((item) => item.baseSlug !== service.baseSlug).slice(0, 6);
  const quickAnswer = serviceHumanIntro(service, city);
  const humanNote = serviceHumanNote(service, city);
  const decisionFit = serviceDecisionFit(service);
  const observedDetail = cityObservedDetail(city);
  const useCaseBinding = serviceUseCaseBinding(service);
  const quantifiedComparison = serviceQuantifiedComparison(service);

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
<meta property="og:image" content="${ORIGIN}${heroImage}">
<meta name="author" content="Garage Door Repair Genie">
<link rel="icon" href="/favicon.ico" sizes="any">
<link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png">
<link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png">
<link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png">
<link rel="stylesheet" href="/styles.css">
</head>
<body itemscope itemtype="https://schema.org/LocalBusiness">
  ${header(city)}
<nav class="breadcrumbs container" aria-label="Breadcrumb">
  <a href="/">Home</a> <span aria-hidden="true">&gt;</span> <a href="/${cityLandingSlug(city)}/">${cityName}</a> <span aria-hidden="true">&gt;</span> <span>${esc(service.label)}</span>
</nav>

<section class="hero hero-service">
  <div class="container">
    <div class="hero-copy">
      <p class="eyebrow">Local ${esc(service.label)}</p>
      <h1 itemprop="name">${esc(h1)}</h1>
      <p class="hero-sub">${esc(quickAnswer)}</p>
      <div class="hero-cta">
        <a href="tel:${phoneTel(city)}" class="btn btn-call btn-lg">Call ${phoneDisplay(city)}</a>
        <a href="#service-details" class="btn btn-secondary">See What We Fix</a>
      </div>
    </div>
    <figure class="hero-media">
      <img src="${heroImage}" alt="${esc(h1)} from Garage Door Repair Genie" width="1200" height="675" loading="eager" fetchpriority="high">
    </figure>
  </div>
</section>

<section class="quick-summary">
  <div class="container">
    <h2>Quick Answer</h2>
    <p itemprop="description">${esc(quickAnswer)}</p>
    <ul class="key-points">
      <li>Best next step: call before forcing a damaged or stuck door</li>
      <li>Local ${esc(service.label.toLowerCase())} for homeowners in ${cityName}</li>
      <li>Same-day dispatch is often available when you call early</li>
      <li>Common related calls: ${esc(service.secondary.slice(0, 3).join(", "))}</li>
      <li>Call first for the fastest service window and a local estimate</li>
    </ul>
  </div>
</section>

<section class="content-block human-note" data-generated="human-writing">
  <div class="container">
    <h2>A Quick Real-World Note</h2>
    <p>${esc(humanNote)}</p>
  </div>
</section>

<section id="service-details" class="content-block">
  <div class="container">
    <h2>${esc(titleCaseKeyword(service.secondary[0]))} in ${city.name}</h2>
    <p>${esc(service.problem)} If you are in ${cityName}, call the Genie and describe the symptom. We route the call around the actual problem, not a generic appointment script.</p>
    ${service.safety ? `<p class="callout"><strong>Safety warning:</strong> Do not force a garage door with a broken spring, snapped cable, or off-track section. Garage doors are heavy and can be dangerous when the counterbalance system fails.</p>` : ""}
  </div>
</section>

<section class="content-block sop-fit" itemscope itemtype="https://schema.org/Service">
  <div class="container">
    <h2>Which Repair Fits This Problem?</h2>
    <p itemprop="serviceType">${esc(decisionFit)}</p>
    <p>${esc(observedDetail)}</p>
    <p>${esc(useCaseBinding)}</p>
    <p>${esc(quantifiedComparison)}</p>
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
      ${nearby.map((area) => `<span class="area-card" itemprop="areaServed"><span class="area-title">${esc(area)}</span><span>${esc(service.label)} coverage near ${city.name}</span></span>`).join("\n      ")}
    </div>
  </div>
</section>

<section class="content-block local-contact" data-generated="local-contact">
  <div class="container">
    <h2>Local ${esc(city.name)} Contact Details</h2>
    <div class="cards">
      <div class="card">
        <h3>Call Garage Door Repair Genie</h3>
        <p><a href="tel:${phoneTel(city)}" itemprop="telephone">${phoneDisplay(city)}</a></p>
      </div>
      <div class="card" itemprop="address" itemscope itemtype="https://schema.org/PostalAddress">
        <h3>${esc(city.name)} Service Address</h3>
        <p><span itemprop="streetAddress">${esc(city.streetAddress)}</span>, <span itemprop="addressLocality">${esc(city.name)}</span>, <span itemprop="addressRegion">${esc(city.state)}</span> <span itemprop="postalCode">${esc(city.postalCode)}</span></p>
      </div>
    </div>
  </div>
</section>

<section class="service-areas">
  <div class="container">
    <h2>Related Garage Door Services in ${city.name}</h2>
    <p class="section-intro">Each page owns a separate service keyword cluster for ${cityName}, which keeps the site focused and reduces cannibalization.</p>
    <div class="areas-grid">
      ${relatedServices.map((item) => `<a class="area-card" href="/${serviceSlug(item, city)}/" itemprop="url"><span class="area-title">${esc(item.label)} ${city.name} ${city.state}</span><span>${esc(item.secondary.slice(0, 2).join(" / "))}</span></a>`).join("\n      ")}
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
  "telephone": phoneTel(city),
  "description": quickAnswer,
  "priceRange": "$$",
  "address": {
    "@type": "PostalAddress",
    "streetAddress": city.streetAddress,
    "addressLocality": city.name,
    "addressRegion": city.state,
    "postalCode": city.postalCode,
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
  "description": quickAnswer,
  "provider": { "@type": "LocalBusiness", "name": `Garage Door Repair Genie - ${cityName}`, "url": canonical, "telephone": phoneTel(city), "address": { "@type": "PostalAddress", "streetAddress": city.streetAddress, "addressLocality": city.name, "addressRegion": city.state, "postalCode": city.postalCode, "addressCountry": "US" } },
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
    { "@type": "ListItem", "position": 2, "name": cityName, "item": `${ORIGIN}/${cityLandingSlug(city)}/` },
    { "@type": "ListItem", "position": 3, "name": service.label, "item": canonical }
  ]
}, null, 2)}
</script>

<section class="final-cta">
  <div class="container">
    <h2>Call the Genie for ${esc(service.label)} in ${city.name}</h2>
    <p>Garage door problem? Let's make it disappear. Call now for the fastest path to local help.</p>
    <a href="tel:${phoneTel(city)}" class="btn btn-call btn-lg">Call ${phoneDisplay(city)}</a>
  </div>
</section>

${footer(city)}
<a href="tel:${phoneTel(city)}" class="sticky-cta" aria-label="Call Garage Door Repair Genie">Call Garage Door Repair Genie</a>
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
      ${services.filter((service) => service.baseSlug !== "garage-door-repair").map((service) => `<a class="area-card" href="/${serviceSlug(service, city)}/" itemprop="url"><span class="area-title">${esc(service.label)} ${city.name} ${city.state}</span><span>${esc(service.secondary.slice(0, 2).join(" / "))}</span></a>`).join("\n      ")}
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
      ${cities.map((city) => `<a class="area-card" href="/${servicePageSlug(service, city)}/" itemprop="url"><span class="area-title">${esc(service.label)} ${city.name} ${city.state}</span><span>${esc(city.nearby.slice(0, 3).join(" / "))}</span></a>`).join("\n      ")}
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

function injectCityLandingSchemas(city) {
  const filePath = join(PAGES_DIR, `${cityLandingSlug(city)}.html`);
  const cityName = `${city.name}, ${city.state}`;
  const canonical = `${ORIGIN}/${cityLandingSlug(city)}/`;
  const schema = `<script type="application/ld+json" data-generated="city-landing-service-schema">
${JSON.stringify({
  "@context": "https://schema.org",
  "@type": "Service",
  "name": `Garage Door Repair in ${cityName}`,
  "serviceType": "Garage Door Repair",
  "provider": {
    "@type": "LocalBusiness",
    "name": `Garage Door Repair Genie - ${cityName}`,
    "telephone": phoneTel(city),
    "url": canonical,
    "address": {
      "@type": "PostalAddress",
      "streetAddress": city.streetAddress,
      "addressLocality": city.name,
      "addressRegion": city.state,
      "postalCode": city.postalCode,
      "addressCountry": "US"
    }
  },
  "areaServed": [
    { "@type": "City", "name": cityName },
    ...city.nearby.slice(0, 8).map((place) => ({ "@type": "Place", "name": place }))
  ],
  "url": canonical
}, null, 2)}
</script>
<script type="application/ld+json" data-generated="city-landing-breadcrumb-schema">
${JSON.stringify({
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  "itemListElement": [
    { "@type": "ListItem", "position": 1, "name": "Home", "item": `${ORIGIN}/` },
    { "@type": "ListItem", "position": 2, "name": cityName, "item": canonical }
  ]
}, null, 2)}
</script>

`;
  let source = readFileSync(filePath, "utf8");
  source = source.replace(/<script type="application\/ld\+json" data-generated="city-landing-service-schema">[\s\S]*?<\/script>\s*/m, "");
  source = source.replace(/<script type="application\/ld\+json" data-generated="city-landing-breadcrumb-schema">[\s\S]*?<\/script>\s*/m, "");
  source = source.replace(/<section class="final-cta">/, `${schema}<section class="final-cta">`);
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
    ...cities.map((city) => cityLandingSlug(city)),
    ...paaSlugs,
    "contact"
  ];
  const cityService = cities.flatMap((city) => services.filter((service) => service.baseSlug !== "garage-door-repair").map((service) => serviceSlug(service, city)));
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
    rows.push(`| \`/${cityLandingSlug(city)}/\` | garage door repair ${city.name} ${city.state} | garage door service; garage door repair near me; broken garage door; garage door won't open; garage door won't close; garage door stuck |`);
    for (const service of services) {
      if (service.baseSlug === "garage-door-repair") continue;
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
    if (service.baseSlug === "garage-door-repair") continue;
    const slug = serviceSlug(service, city);
    writeFileSync(join(PAGES_DIR, `${slug}.html`), pageHtml(service, city));
  }
  injectOnce(join(PAGES_DIR, `${cityLandingSlug(city)}.html`), "city-service-links", cityServiceLinks(city), /<section class="faq">/);
  injectOnce(join(PAGES_DIR, `${cityLandingSlug(city)}.html`), "city-local-map", cityLocalMap(city), /<section class="content-block city-service-links" data-generated="city-service-links">/);
  injectCityLandingSchemas(city);
}

for (const service of services) {
  injectOnce(join(PAGES_DIR, `${service.baseSlug}.html`), "service-city-links", serviceCityLinks(service), /<!-- ======= FAQ ======= -->|<section class="faq">/);
}

const sitemap = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${sitemapUrls().map((slug) => `  <url><loc>${ORIGIN}/${slug ? `${slug}/` : ""}</loc></url>`).join("\n")}\n</urlset>\n`;
writeFileSync("public/sitemap.xml", sitemap);
writeKeywordMap();

console.log(`Generated ${cities.length * (services.length - 1)} city-service pages, sitemap.xml, and KEYWORD_MAP.md.`);
