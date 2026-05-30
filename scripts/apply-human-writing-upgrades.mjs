import { readdirSync, readFileSync, writeFileSync } from "node:fs";

const PAGES_DIR = "public/pages";

const cityNames = [
  "San Antonio", "Marietta", "Portland", "Vancouver", "Savannah", "Atlanta", "Roswell",
  "Stone Oak", "Alamo Heights", "East Cobb", "West Cobb", "Whitlock", "Sandy Plains"
];

function stripTags(html) {
  return html.replace(/<script[\s\S]*?<\/script>/gi, " ").replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
}

function titleFor(html, file) {
  const h1 = html.match(/<h1[^>]*>([\s\S]*?)<\/h1>/i)?.[1];
  return stripTags(h1 || file.replace(/-/g, " ").replace(/\.html$/, ""));
}

function cityFor(text) {
  return cityNames.find((name) => new RegExp(`\\b${name}\\b`, "i").test(text)) || "your area";
}

function pageKind(file, title) {
  if (file === "home.html") return "home";
  if (file === "contact.html") return "contact";
  if (/cost/.test(file)) return "cost";
  if (/spring/.test(file)) return "spring";
  if (/opener/.test(file)) return "opener";
  if (/cable|wire/.test(file)) return "cable";
  if (/off-track|come-off-track/.test(file)) return "track";
  if (/emergency|stuck-open|stuck-closed/.test(file)) return "emergency";
  if (/garage-door-repair/.test(file) || /repair/i.test(title)) return "repair";
  return "guide";
}

function blockFor(file, html) {
  const title = titleFor(html, file);
  const city = cityFor(stripTags(html));
  const kind = pageKind(file, title);

  const blocks = {
    home: [
      "Here's the honest version: most people don't call a garage door company because they're shopping around for fun. They call because the door just made a noise it has never made before, or the car is stuck, or the house is sitting open to the street.",
      "If that's you, start with what happened first. Did you hear a bang? Did the door reverse? Did one side drop? You don't need the perfect part name. Those plain details are usually enough to get the call moving in the right direction."
    ],
    contact: [
      "If you're debating between calling and filling out the form, call when the door is stuck, crooked, open, or unsafe. Use the form when the door still works and you're trying to plan a repair.",
      "That sounds obvious, but it matters. A stuck-open door in your area needs a different response than a noisy roller you can live with until tomorrow."
    ],
    cost: [
      "Nobody likes getting a vague repair range. I get it. The reason garage door pricing has a range is that a sensor reset, a broken spring, and a crooked door are completely different calls.",
      "So what should you look at first? Notice whether your door feels heavy, whether one side is lower, and whether your opener is only humming. Those clues usually explain why one repair is cheap and another isn't for you."
    ],
    spring: [
      "A broken spring is one of those repairs where confidence can get expensive fast. The door may look normal, but the part that carried the weight is no longer doing its job.",
      "If you heard a bang or your door suddenly feels heavy, don't test it three more times. Tell the tech what happened first. That little detail usually matters more than your guess about the brand or model."
    ],
    opener: [
      "Opener trouble is annoying because it can look random. The remote fails, then the wall button works, then the door reverses like it changed its mind.",
      "Before you assume the motor is dead, ask one question: does the door move smoothly by hand? If it doesn't, the opener may be the messenger, not the problem."
    ],
    cable: [
      "A cable problem can look like one loose wire, but it's really a balance problem. Once one side stops lifting evenly, the door can twist fast.",
      "If you see a cable hanging or your door dropped crooked, don't try one more opener cycle. That's usually the moment your repairable door becomes a bent-panel problem."
    ],
    track: [
      "An off-track door has a way of making people want to push, pry, or bump it back into place. That's understandable. It's also where a lot of damage starts.",
      "If your door is crooked in your area, stop before the next button press. Tell the tech which side is higher and whether you can see a roller outside your track."
    ],
    emergency: [
      "Emergency garage door calls are stressful because they usually interrupt something else. You're leaving for work, closing up at night, or staring at an open garage when you wanted to be done for the day.",
      "The first goal isn't a perfect explanation. It's making the door safe. After that, the tech can sort out whether the real culprit is a spring, cable, track, sensor, or opener."
    ],
    repair: [
      "Garage door repair starts with a simple question: what changed? A bang, a grind, a crooked lift, or a sudden reversal each points somewhere different.",
      `If you're in ${city}, mention the first symptom before you mention what you think broke. That keeps the conversation grounded and helps dispatch send the right help.`
    ],
    guide: [
      "Quick note before you start troubleshooting: garage doors are heavy, and some parts are under real tension. Start there.",
      "A small clue can help you explain the problem, but a forced test can make things worse, especially when you're dealing with a spring, cable, roller, or opener that already failed once.",
      "So ask yourself what happened first. Did your door get heavy, crooked, noisy, or stuck? That's the detail you want to remember when you call."
    ]
  };

  const paragraphs = blocks[kind] || blocks.guide;
  return `<section class="content-block human-note" data-generated="human-writing">
  <div class="container">
    <h2>A Quick Human Note</h2>
    ${paragraphs.map((paragraph) => `<p>${paragraph}</p>`).join("\n    ")}
  </div>
</section>

`;
}

function upsertBlock(html, file) {
  let next = html.replace(/<section class="content-block human-note" data-generated="human-writing"[\s\S]*?<\/section>\s*/m, "");
  const block = blockFor(file, next);
  const target = next.match(/<section class="faq">|<!-- ======= FAQ ======= -->|<section class="final-cta">/);
  if (!target) return next;
  return next.slice(0, target.index) + block + next.slice(target.index);
}

for (const file of readdirSync(PAGES_DIR).filter((name) => name.endsWith(".html"))) {
  const path = `${PAGES_DIR}/${file}`;
  const html = readFileSync(path, "utf8");
  writeFileSync(path, upsertBlock(html, file));
}

console.log("Applied human-writing SOP blocks across HTML pages.");
