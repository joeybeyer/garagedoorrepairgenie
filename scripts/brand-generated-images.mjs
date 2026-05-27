import sharp from "sharp";
import { mkdirSync } from "node:fs";
import { basename, join } from "node:path";

const OUT_DIR = "public/images/branded";
const WIDTH = 1200;
const HEIGHT = 675;

const inputs = [
  "garage-door-repair-service-brand.webp",
  "garage-door-spring-repair-brand.webp",
  "garage-door-opener-repair-brand.webp",
  "garage-door-cable-repair-brand.webp",
  "off-track-garage-door-repair-brand.webp",
  "emergency-garage-door-repair-brand.webp",
  "garage-door-repair-cost-brand.webp"
];

function overlay() {
  return Buffer.from(`
  <svg width="${WIDTH}" height="${HEIGHT}" viewBox="0 0 ${WIDTH} ${HEIGHT}" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="shade" x1="0" y1="0" x2="1" y2="0">
        <stop offset="0" stop-color="#111827" stop-opacity="0.38"/>
        <stop offset="0.34" stop-color="#111827" stop-opacity="0.16"/>
        <stop offset="1" stop-color="#111827" stop-opacity="0"/>
      </linearGradient>
    </defs>
    <rect width="${WIDTH}" height="${HEIGHT}" fill="url(#shade)"/>
    <rect x="0" y="0" width="10" height="${HEIGHT}" fill="#f97316"/>
    <rect x="10" y="0" width="4" height="${HEIGHT}" fill="#14b8a6"/>
    <rect x="14" y="0" width="2" height="${HEIGHT}" fill="#fbbf24" fill-opacity="0.82"/>
  </svg>`);
}

mkdirSync(OUT_DIR, { recursive: true });

for (const input of inputs) {
  const src = join("public/images/generated", input);
  const outName = basename(input).replace("-brand.webp", ".webp");
  const out = join(OUT_DIR, outName);

  await sharp(src)
    .resize(WIDTH, HEIGHT, { fit: "cover", position: "center" })
    .composite([{ input: overlay(), left: 0, top: 0 }])
    .webp({ quality: 78, effort: 6 })
    .toFile(out);

  console.log(out);
}
