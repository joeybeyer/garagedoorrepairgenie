import { readdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const ORIGIN = "https://garagedoorrepairgenie.com";
const PHONE_DISPLAY = "(000) 000-0000";
const PHONE_TEL = "+10000000000";
const PAGES_DIR = "public/pages";

const topTips = [
  { href: "/what-to-do-if-garage-door-spring-breaks/", label: "Spring Breaks" },
  { href: "/how-to-know-if-garage-door-spring-is-broken/", label: "Broken Spring Signs" },
  { href: "/why-is-my-garage-door-stuck-open/", label: "Door Stuck Open" },
  { href: "/why-is-my-garage-door-stuck-closed/", label: "Door Stuck Closed" },
  { href: "/how-much-does-garage-door-repair-cost/", label: "Repair Cost" }
];

const serviceLinks = [
  { href: "/garage-door-repair/", label: "Garage Door Repair" },
  { href: "/garage-door-spring-repair/", label: "Spring Repair" },
  { href: "/garage-door-torsion-spring-repair/", label: "Torsion Spring Repair" },
  { href: "/garage-door-opener-repair/", label: "Opener Repair" },
  { href: "/emergency-garage-door-repair/", label: "Emergency Repair" },
  { href: "/off-track-garage-door-repair/", label: "Off-Track Doors" },
  { href: "/garage-door-cable-repair/", label: "Cable Repair" }
];

const cityLinks = [
  { href: "/garage-door-repair-portland-or/", label: "Portland, OR" },
  { href: "/garage-door-repair-vancouver-wa/", label: "Vancouver, WA" },
  { href: "/garage-door-repair-savannah-ga/", label: "Savannah, GA" },
  { href: "/garage-door-repair-marietta-ga/", label: "Marietta, GA" },
  { href: "/garage-door-repair-atlanta-ga/", label: "Atlanta, GA" },
  { href: "/garage-door-repair-roswell-ga/", label: "Roswell, GA" },
  { href: "/garage-door-repair-san-antonio-tx/", label: "San Antonio, TX" }
];

function imageForPage(slug) {
  if (slug.includes("stuck-open") || slug.includes("stuck-closed")) return "emergency-garage-door-repair.webp";
  if (slug.includes("opener")) return "garage-door-opener-repair.webp";
  if (slug.includes("cable") || slug.includes("wire")) return "garage-door-cable-repair.webp";
  if (slug.includes("come-off-track")) return "off-track-garage-door-repair.webp";
  if (slug.includes("how-much") || slug.includes("cost")) return "garage-door-repair-cost.webp";
  if (slug.includes("spring")) return "garage-door-spring-repair.webp";
  return "garage-door-repair-service.webp";
}

const pages = [
  {
    slug: "how-much-does-garage-door-repair-cost",
    question: "How much does garage door repair cost?",
    title: "How Much Does Garage Door Repair Cost? | Garage Door Repair Genie",
    meta: "Garage door repair usually costs $150 to $600 depending on parts, problem type, door size, and local labor. Call for a local estimate.",
    answer: "Garage door repair usually costs between $150 and $600 depending on the problem, parts needed, door type, and local labor rates. Simple sensor, remote, or adjustment calls are usually lower. Broken springs, cables, tracks, panels, and opener repairs can cost more.",
    intro: "Garage Door Repair Genie helps homeowners understand the likely repair range before they call. Pricing can vary by market and door condition, so the fastest path is a quick phone call for a local estimate.",
    sections: [
      ["What Changes the Price", "The biggest cost factors are the failed part, door weight, spring type, opener model, cable condition, panel damage, service urgency, and whether the technician can finish the repair in one visit."],
      ["Common Repair Ranges", "Sensor alignment, remote programming, and minor adjustments are typically less expensive than replacing springs, cables, rollers, tracks, or opener motors. Emergency calls can also carry different local rates."],
      ["When a Cheap Fix Gets Expensive", "Forcing a broken garage door can bend panels, burn out the opener, snap cables, or knock rollers out of the track. If the door feels heavy, crooked, or stuck, stop using it and call."],
      ["Get a Local Estimate", "Call Garage Door Repair Genie and describe the symptom. We can route the call toward the right service category and help you understand what a local technician may need to inspect."]
    ],
    related: [
      ["What should I do if my garage door spring breaks?", "/what-to-do-if-garage-door-spring-breaks/"],
      ["Why is my garage door opener not working?", "/why-is-my-garage-door-opener-not-working/"],
      ["Why did my garage door cable snap?", "/why-did-my-garage-door-cable-snap/"]
    ],
    links: ["/garage-door-repair/", "/cost-to-replace-garage-door-spring/"]
  },
  {
    slug: "what-to-do-if-garage-door-spring-breaks",
    question: "What should I do if my garage door spring breaks?",
    title: "What Should I Do If My Garage Door Spring Breaks? | Garage Door Repair Genie",
    meta: "If your garage door spring breaks, do not force the door or keep running the opener. Learn what to do next and when to call.",
    answer: "If your garage door spring breaks, do not force the door open or keep running the opener. A broken spring means the door is no longer properly balanced and may be extremely heavy. Keep people clear of the door and call for garage door spring repair.",
    intro: "When a spring breaks, the safest move is to stop using the door. Garage Door Repair Genie helps homeowners get fast local service for broken, snapped, or worn-out garage door springs.",
    sections: [
      ["Signs the Spring Broke", "You may hear a loud bang, see a visible gap in the spring, notice the door feels too heavy, or watch the opener hum while the door only moves a few inches."],
      ["Why You Should Not Force the Door", "Garage doors can weigh hundreds of pounds. Springs balance that weight. Without a working spring, forcing the door can damage the opener, cables, tracks, panels, or cause the door to fall."],
      ["What to Do While You Wait", "Park outside if possible, keep children and pets away, do not pull the emergency release while standing under the door, and do not keep pressing the opener button."],
      ["When to Call the Genie", "Call as soon as you suspect spring failure. Spring work involves high-tension parts and should be handled by a trained garage door repair technician."]
    ],
    related: [
      ["How do I know if my garage door spring is broken?", "/how-to-know-if-garage-door-spring-is-broken/"],
      ["How much does garage door repair cost?", "/how-much-does-garage-door-repair-cost/"],
      ["Why is my garage door stuck closed?", "/why-is-my-garage-door-stuck-closed/"]
    ],
    links: ["/garage-door-spring-repair/", "/garage-door-spring-snapped/"]
  },
  {
    slug: "how-to-know-if-garage-door-spring-is-broken",
    question: "How do I know if my garage door spring is broken?",
    title: "How Do I Know If My Garage Door Spring Is Broken? | Garage Door Repair Genie",
    meta: "Signs of a broken garage door spring include a loud bang, heavy door, visible spring gap, crooked movement, or a door that barely opens.",
    answer: "Signs of a broken garage door spring include a loud bang from the garage, a door that feels too heavy to lift, a visible gap in the spring, crooked movement, or a door that only opens a few inches before stopping.",
    intro: "A broken spring is one of the most common reasons a garage door suddenly stops working. Garage Door Repair Genie can help you identify the warning signs and call for the right service.",
    sections: [
      ["Look Above the Door", "On torsion spring systems, the spring sits on a metal bar above the door. A broken torsion spring often has a clean gap in the coil."],
      ["Watch How the Door Moves", "If the opener pulls the door up a few inches and stops, or if one side rises faster than the other, the spring or cable system may be failing."],
      ["Listen for the Bang", "Many homeowners hear a sharp bang before noticing anything else. That sound can be the spring releasing tension."],
      ["Stop Before More Parts Break", "A bad spring can overload the opener and cables. Do not keep testing the door if it feels heavy, crooked, or stuck."]
    ],
    related: [
      ["What should I do if my garage door spring breaks?", "/what-to-do-if-garage-door-spring-breaks/"],
      ["Why is my garage door stuck closed?", "/why-is-my-garage-door-stuck-closed/"],
      ["How much does garage door repair cost?", "/how-much-does-garage-door-repair-cost/"]
    ],
    links: ["/garage-door-spring-repair/", "/garage-door-torsion-spring-repair/"]
  },
  {
    slug: "why-is-my-garage-door-stuck-open",
    question: "Why is my garage door stuck open?",
    title: "Why Is My Garage Door Stuck Open? | Garage Door Repair Genie",
    meta: "A garage door can get stuck open because of a broken spring, cable issue, damaged track, opener failure, or sensor problem.",
    answer: "A garage door can get stuck open because of a broken spring, snapped cable, damaged track, opener failure, sensor problem, or jammed roller. Because an open garage creates a security risk, treat this as an urgent repair call.",
    intro: "A door stuck open leaves your home, belongings, and garage exposed. Garage Door Repair Genie helps homeowners get fast local help when the door will not close safely.",
    sections: [
      ["Common Causes", "The most common causes are spring failure, cable problems, blocked or misaligned sensors, opener travel-limit issues, bent tracks, or rollers that came loose."],
      ["What Not to Do", "Do not force the door down if it is crooked, jammed, or hanging unevenly. That can bend tracks, damage panels, or cause the door to drop."],
      ["When It Is an Emergency", "A stuck-open door is urgent when the garage faces the street, bad weather is coming, pets or children are nearby, or the door is visibly unstable."],
      ["How a Tech Diagnoses It", "A technician checks balance, springs, cables, rollers, tracks, sensors, and opener settings before closing or repairing the door."]
    ],
    related: [
      ["Why is my garage door stuck closed?", "/why-is-my-garage-door-stuck-closed/"],
      ["Why did my garage door cable snap?", "/why-did-my-garage-door-cable-snap/"],
      ["Why did my garage door come off track?", "/why-did-my-garage-door-come-off-track/"]
    ],
    links: ["/emergency-garage-door-repair/", "/garage-door-cable-repair/"]
  },
  {
    slug: "why-is-my-garage-door-stuck-closed",
    question: "Why is my garage door stuck closed?",
    title: "Why Is My Garage Door Stuck Closed? | Garage Door Repair Genie",
    meta: "A garage door can get stuck closed because of a broken spring, locked opener, snapped cable, power issue, or track problem.",
    answer: "A garage door can get stuck closed because of a broken spring, locked or disconnected opener, snapped cable, power issue, dead remote, stripped opener gear, or track obstruction. If the door feels heavy, do not force it open.",
    intro: "A stuck-closed garage door can trap your car and disrupt the whole day. Garage Door Repair Genie helps homeowners get routed to the right repair category quickly.",
    sections: [
      ["Most Likely Causes", "Broken springs, bad opener gears, power problems, cable issues, engaged manual locks, and track obstructions are the usual suspects."],
      ["Check the Safe Basics", "You can check the wall outlet, breaker, remote battery, and manual lock. Do not keep pulling or lifting if the door feels unusually heavy."],
      ["Broken Spring Warning", "If the opener runs but the door barely moves, the spring may be broken. The opener is not designed to lift the full door weight alone."],
      ["When to Call", "Call when the door will not lift, is crooked, made a loud bang, or traps a vehicle inside the garage."]
    ],
    related: [
      ["How do I know if my garage door spring is broken?", "/how-to-know-if-garage-door-spring-is-broken/"],
      ["Why is my garage door opener not working?", "/why-is-my-garage-door-opener-not-working/"],
      ["What should I do if my garage door spring breaks?", "/what-to-do-if-garage-door-spring-breaks/"]
    ],
    links: ["/emergency-garage-door-repair/", "/garage-door-spring-repair/"]
  },
  {
    slug: "why-is-my-garage-door-opener-not-working",
    question: "Why is my garage door opener not working?",
    title: "Why Is My Garage Door Opener Not Working? | Garage Door Repair Genie",
    meta: "A garage door opener may stop working because of power loss, bad remotes, sensors, stripped gears, motor failure, or a disconnected door.",
    answer: "A garage door opener may stop working because of power loss, dead remotes, bad keypad batteries, misaligned sensors, stripped gears, motor failure, broken springs, or a disconnected emergency release. The symptom tells you where to start.",
    intro: "Opener problems can be simple or serious. Garage Door Repair Genie helps homeowners sort out whether the issue is the opener, sensor system, spring system, or door hardware.",
    sections: [
      ["Start with Power and Remotes", "Check the opener outlet, breaker, remote batteries, keypad batteries, wall button, and whether the opener lights respond."],
      ["Sensor Problems", "If the door starts to close and reverses, the safety sensors may be dirty, blocked, misaligned, unplugged, or damaged."],
      ["Motor or Gear Problems", "A clicking or humming opener can point to a bad capacitor, stripped gear, worn motor, jammed rail, or a door that is too heavy because the spring failed."],
      ["When Repair Makes Sense", "Many openers can be repaired when the issue involves sensors, remotes, wiring, gears, belts, chains, or motor components."]
    ],
    related: [
      ["Why is my garage door stuck closed?", "/why-is-my-garage-door-stuck-closed/"],
      ["How do I know if my garage door spring is broken?", "/how-to-know-if-garage-door-spring-is-broken/"],
      ["How much does garage door repair cost?", "/how-much-does-garage-door-repair-cost/"]
    ],
    links: ["/garage-door-opener-repair/"]
  },
  {
    slug: "why-did-my-garage-door-cable-snap",
    question: "Why did my garage door cable snap?",
    title: "Why Did My Garage Door Cable Snap? | Garage Door Repair Genie",
    meta: "Garage door cables can snap from age, rust, worn pulleys, broken springs, poor tension, or off-track door damage.",
    answer: "Garage door cables can snap from age, rust, worn pulleys, broken springs, poor cable tension, damaged drums, or stress from a door going off track. If a cable breaks, stop using the door because it can hang crooked or fall.",
    intro: "A snapped cable is a safety problem, not just a noisy part. Garage Door Repair Genie helps homeowners get fast local help for cable and wire problems.",
    sections: [
      ["What the Cable Does", "Garage door cables work with the spring system to lift and balance the door. When one cable fails, the door often twists or drops on one side."],
      ["Why Cables Fail", "Rust, age, fraying, worn pulleys, incorrect tension, broken springs, and impact damage can all cause a cable to snap or jump the drum."],
      ["Why You Should Stop Using the Door", "Running the opener after a cable breaks can bend panels, damage tracks, pull rollers loose, and make the repair more expensive."],
      ["Cable or Spring Problem", "Cable failure and spring failure often happen together. A technician should inspect the full counterbalance system before replacing parts."]
    ],
    related: [
      ["What is the wire on my garage door called?", "/what-is-the-wire-on-my-garage-door-called/"],
      ["Why did my garage door come off track?", "/why-did-my-garage-door-come-off-track/"],
      ["Why is my garage door stuck open?", "/why-is-my-garage-door-stuck-open/"]
    ],
    links: ["/garage-door-cable-repair/", "/garage-door-wire-broke/"]
  },
  {
    slug: "what-is-the-wire-on-my-garage-door-called",
    question: "What is the wire on my garage door called?",
    title: "What Is the Wire on My Garage Door Called? | Garage Door Repair Genie",
    meta: "The wire on a garage door is usually called a cable. Garage door cables help lift and balance the door with the spring system.",
    answer: "The wire on a garage door is usually called a cable. Garage door cables run along the sides of the door and work with the spring system to lift, lower, and balance the door safely.",
    intro: "Homeowners often call it a wire, rope, or line. In garage door repair, the part is usually the lift cable, and Garage Door Repair Genie can help when it breaks, frays, or comes off.",
    sections: [
      ["What Garage Door Cables Do", "Cables attach to the bottom brackets and wind around drums as the door opens and closes. They help transfer spring tension into smooth door movement."],
      ["Signs the Cable Is Failing", "Look for fraying strands, a loose cable hanging near the track, a crooked door, grinding movement, or one side of the door dropping."],
      ["Why Cable Work Is Not DIY", "Cables connect to the spring counterbalance system. If the tension releases unexpectedly, the door can move violently or fall."],
      ["When to Call", "Call when the cable is loose, snapped, frayed, wrapped wrong, or when the door is crooked and stuck."]
    ],
    related: [
      ["Why did my garage door cable snap?", "/why-did-my-garage-door-cable-snap/"],
      ["Why did my garage door come off track?", "/why-did-my-garage-door-come-off-track/"],
      ["How do I know if my garage door spring is broken?", "/how-to-know-if-garage-door-spring-is-broken/"]
    ],
    links: ["/garage-door-wire-broke/", "/garage-door-cable-repair/"]
  },
  {
    slug: "why-did-my-garage-door-come-off-track",
    question: "Why did my garage door come off track?",
    title: "Why Did My Garage Door Come Off Track? | Garage Door Repair Genie",
    meta: "A garage door can come off track because of broken cables, damaged rollers, bent tracks, impact damage, or operating the door while jammed.",
    answer: "A garage door can come off track because of broken cables, damaged rollers, bent tracks, loose hardware, impact damage, or operating the opener while the door is jammed. Stop using the door until it is inspected.",
    intro: "An off-track garage door can get worse quickly if the opener keeps pulling against it. Garage Door Repair Genie helps homeowners get local repair help before panels and tracks take more damage.",
    sections: [
      ["Common Causes", "Bumper impact, broken cables, worn rollers, bent tracks, loose brackets, spring problems, and forced operation are common reasons a door leaves the track."],
      ["What You Might Notice", "The door may look crooked, bind on one side, make scraping sounds, hang partly open, or stop with a roller outside the track."],
      ["Do Not Force It", "Forcing an off-track door can bend panels, twist tracks, damage the opener arm, or cause the door to fall."],
      ["How It Gets Fixed", "A technician stabilizes the door, reseats or replaces rollers, checks cables and springs, straightens or replaces track sections, and tests balance."]
    ],
    related: [
      ["Why did my garage door cable snap?", "/why-did-my-garage-door-cable-snap/"],
      ["Why is my garage door stuck open?", "/why-is-my-garage-door-stuck-open/"],
      ["What is the wire on my garage door called?", "/what-is-the-wire-on-my-garage-door-called/"]
    ],
    links: ["/off-track-garage-door-repair/", "/garage-door-cable-repair/"]
  }
];

function esc(text) {
  return String(text).replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;").replaceAll('"', "&quot;");
}

function tipsDropdown() {
  return `<li class="has-dropdown">
          <a href="/cost-to-replace-garage-door-spring/">Garage Door Tips</a>
          <ul class="dropdown">
            ${topTips.map((item) => `<li><a href="${item.href}">${esc(item.label)}</a></li>`).join("\n            ")}
          </ul>
        </li>`;
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
            ${serviceLinks.map((item) => `<li><a href="${item.href}">${esc(item.label)}</a></li>`).join("\n            ")}
          </ul>
        </li>
        <li class="has-dropdown">
          <a href="/garage-door-repair-portland-or/">Service Areas</a>
          <ul class="dropdown">
            ${cityLinks.map((item) => `<li><a href="${item.href}">${esc(item.label)}</a></li>`).join("\n            ")}
          </ul>
        </li>
        ${tipsDropdown()}
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
      <ul>${serviceLinks.map((item) => `<li><a href="${item.href}">${esc(item.label)}</a></li>`).join("")}</ul>
    </div>
    <div class="footer-col">
      <h4>Service Areas</h4>
      <ul>${cityLinks.map((item) => `<li><a href="${item.href}">${esc(item.label)}</a></li>`).join("")}</ul>
    </div>
    <div class="footer-col">
      <h4>Garage Door Tips</h4>
      <ul>${topTips.map((item) => `<li><a href="${item.href}">${esc(item.label)}</a></li>`).join("")}<li><a href="/contact/">Contact</a></li></ul>
    </div>
  </div>
  <div class="container footer-bottom">
    <p class="disclaimer">Garage Door Repair Genie connects homeowners with local garage door repair service providers. Service availability may vary by location.</p>
    <p>&copy; <span id="copyright-year">2026</span> Garage Door Repair Genie. All rights reserved.</p>
  </div>
</footer>`;
}

function pageHtml(page) {
  const canonical = `${ORIGIN}/${page.slug}/`;
  const heroImage = `/images/branded/${imageForPage(page.slug)}`;
  const faqEntities = [
    { q: page.question, a: page.answer },
    ...page.related.map(([q]) => ({
      q,
      a: pages.find((item) => item.question === q)?.answer || "This garage door problem can have several causes. If the door is stuck, unsafe, or hard to lift, call Garage Door Repair Genie for local help."
    }))
  ];

  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>${esc(page.title)}</title>
<meta name="description" content="${esc(page.meta)}">
<link rel="canonical" href="${canonical}">
<meta property="og:title" content="${esc(page.title)}">
<meta property="og:description" content="${esc(page.meta)}">
<meta property="og:url" content="${canonical}">
<meta property="og:type" content="article">
<meta property="og:image" content="${ORIGIN}${heroImage}">
<meta name="author" content="Garage Door Repair Genie">
<link rel="icon" href="/favicon.ico" sizes="any">
<link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png">
<link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png">
<link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png">
<link rel="stylesheet" href="/styles.css">
</head>
<body>
${header()}
<nav class="breadcrumbs container" aria-label="Breadcrumb">
  <a href="/">Home</a> <span aria-hidden="true">&gt;</span> <a href="/cost-to-replace-garage-door-spring/">Garage Door Tips</a> <span aria-hidden="true">&gt;</span> <span>${esc(page.question)}</span>
</nav>

<section class="hero hero-service">
  <div class="container">
    <div class="hero-copy">
      <p class="eyebrow">Garage Door Tips</p>
      <h1>${esc(page.question)}</h1>
      <p class="hero-sub">${esc(page.answer)}</p>
      <div class="hero-cta">
        <a href="tel:${PHONE_TEL}" class="btn btn-call btn-lg">Call ${PHONE_DISPLAY}</a>
        <a href="#quick-answer" class="btn btn-secondary">Read Quick Answer</a>
      </div>
    </div>
    <figure class="hero-media">
      <img src="${heroImage}" alt="${esc(page.question)} from Garage Door Repair Genie" width="1200" height="675" loading="eager" fetchpriority="high">
    </figure>
  </div>
</section>

<section id="quick-answer" class="quick-summary">
  <div class="container quick-answer-box">
    <h2>Quick Answer</h2>
    <p><strong>${esc(page.question)}</strong></p>
    <p>${esc(page.answer)}</p>
  </div>
</section>

<section class="content-block">
  <div class="container">
    <p>${esc(page.intro)}</p>
    ${page.sections.map(([heading, body]) => `<h2>${esc(heading)}</h2>\n    <p>${esc(body)}</p>`).join("\n    ")}
  </div>
</section>

<section class="content-block">
  <div class="container">
    <h2>Related Garage Door Questions</h2>
    <div class="cards">
      ${page.related.map(([q, href]) => `<a class="card" href="${href}"><h3>${esc(q)}</h3><p>Read the quick answer and safety notes.</p></a>`).join("\n      ")}
    </div>
  </div>
</section>

<section class="service-areas">
  <div class="container">
    <h2>Related Garage Door Services</h2>
    <p class="section-intro">Need help now? These service pages match the most likely repair categories.</p>
    <div class="areas-grid">
      ${page.links.map((href) => {
        const label = [...serviceLinks, { href: "/cost-to-replace-garage-door-spring/", label: "Spring Replacement Cost" }, { href: "/garage-door-spring-snapped/", label: "Spring Snapped" }, { href: "/garage-door-wire-broke/", label: "Garage Door Wire Broke" }].find((item) => item.href === href)?.label || href;
        return `<a class="area-card" href="${href}"><strong>${esc(label)}</strong><span>Call the Genie for fast local help.</span></a>`;
      }).join("\n      ")}
    </div>
  </div>
</section>

<script type="application/ld+json">
${JSON.stringify({
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": faqEntities.map((item) => ({
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
    { "@type": "ListItem", "position": 2, "name": "Garage Door Tips", "item": `${ORIGIN}/cost-to-replace-garage-door-spring/` },
    { "@type": "ListItem", "position": 3, "name": page.question, "item": canonical }
  ]
}, null, 2)}
</script>

<section class="final-cta">
  <div class="container">
    <h2>Call Garage Door Repair Genie</h2>
    <p>Need help with a stuck, broken, or unsafe garage door? Call Garage Door Repair Genie for fast local service.</p>
    <a href="tel:${PHONE_TEL}" class="btn btn-call btn-lg">Call ${PHONE_DISPLAY}</a>
  </div>
</section>

${footer()}
<a href="tel:${PHONE_TEL}" class="sticky-cta" aria-label="Call Garage Door Repair Genie">Call Garage Door Repair Genie</a>
<script src="/main.js" defer></script>
</body>
</html>`;
}

function updateTipsDropdowns() {
  const dropdownPattern = /<li class="has-dropdown">\s*<a href="\/cost-to-replace-garage-door-spring\/">Garage Door Tips<\/a>\s*<ul class="dropdown">[\s\S]*?<\/ul>\s*<\/li>/g;
  const footerPattern = /<h4>Garage Door Tips<\/h4>\s*<ul>[\s\S]*?<\/ul>/g;
  const footerLinks = `<h4>Garage Door Tips</h4>
      <ul>
        ${topTips.map((item) => `<li><a href="${item.href}">${esc(item.label)}</a></li>`).join("\n        ")}
        <li><a href="/contact/">Contact</a></li>
      </ul>`;
  for (const file of readdirSync(PAGES_DIR).filter((item) => item.endsWith(".html"))) {
    const path = join(PAGES_DIR, file);
    const source = readFileSync(path, "utf8");
    const updated = source.replace(dropdownPattern, tipsDropdown()).replace(footerPattern, footerLinks);
    if (updated !== source) writeFileSync(path, updated);
  }
}

function updateSitemap() {
  const sitemapPath = "public/sitemap.xml";
  let sitemap = readFileSync(sitemapPath, "utf8");
  const additions = pages.map((page) => `  <url><loc>${ORIGIN}/${page.slug}/</loc></url>`).join("\n");
  for (const page of pages) {
    sitemap = sitemap.replace(new RegExp(`\\s*<url><loc>${ORIGIN}/${page.slug}/</loc></url>`, "g"), "");
  }
  sitemap = sitemap.replace("</urlset>", `${additions}\n</urlset>`);
  writeFileSync(sitemapPath, sitemap);
}

for (const page of pages) {
  writeFileSync(join(PAGES_DIR, `${page.slug}.html`), pageHtml(page));
}

updateTipsDropdowns();
updateSitemap();

console.log(`Generated ${pages.length} PAA pages and updated Garage Door Tips navigation.`);
