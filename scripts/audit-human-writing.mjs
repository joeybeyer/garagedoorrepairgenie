import { readdirSync, readFileSync } from "node:fs";

const PAGES_DIR = "public/pages";

function textFor(html) {
  return html
    .replace(/<script[\s\S]*?<\/script>/gi, " ")
    .replace(/<style[\s\S]*?<\/style>/gi, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/&[^;]+;/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function sentenceLengths(text) {
  return [...text.matchAll(/[^.!?]+[.!?]/g)].map((match) => match[0].trim().split(/\s+/).filter(Boolean).length);
}

const rows = readdirSync(PAGES_DIR).filter((file) => file.endsWith(".html")).sort().map((file) => {
  const html = readFileSync(`${PAGES_DIR}/${file}`, "utf8");
  const text = textFor(html);
  const lengths = sentenceLengths(text);
  const genericHero = /helps homeowners get a broken, stuck, noisy, or unsafe garage door diagnosed/i.test(text);
  const you = [...text.matchAll(/\b(you|your|youre|youll|youve)\b/gi)].length;
  const contractions = [...text.matchAll(/\b\w+'\w+\b/g)].length;
  const questions = [...text.matchAll(/\?/g)].length;
  const humanBlock = /data-generated="human-writing"/.test(html);
  const localRefs = [...text.matchAll(/\b(San Antonio|Marietta|Portland|Vancouver|Savannah|Atlanta|Roswell|Stone Oak|Alamo Heights|East Cobb|West Cobb|Whitlock|Sandy Plains)\b/gi)].length;
  const shortSentences = lengths.filter((count) => count <= 7).length;
  const longSentences = lengths.filter((count) => count >= 24).length;
  const avgSentenceWords = lengths.length ? Math.round((lengths.reduce((sum, count) => sum + count, 0) / lengths.length) * 10) / 10 : 0;

  return {
    file,
    you,
    contractions,
    questions,
    humanBlock,
    genericHero,
    localRefs,
    avgSentenceWords,
    shortSentences,
    longSentences
  };
});

const failures = [];
for (const row of rows) {
  if (!row.humanBlock) failures.push(`${row.file}: missing human-writing block`);
  if (row.genericHero) failures.push(`${row.file}: generic generated hero remains`);
  if (row.you < 3) failures.push(`${row.file}: fewer than 3 reader-address terms (${row.you})`);
  if (row.contractions < 1) failures.push(`${row.file}: no contractions`);
  if (row.questions < 1) failures.push(`${row.file}: no rhetorical/question marks`);
  if (row.shortSentences < 1 || row.longSentences < 1) failures.push(`${row.file}: weak sentence-length variation`);
}

console.log(`pages=${rows.length}`);
console.log(`human_blocks=${rows.filter((row) => row.humanBlock).length}`);
console.log(`generic_hero_pages=${rows.filter((row) => row.genericHero).length}`);
console.log(`low_reader_address_pages=${rows.filter((row) => row.you < 3).length}`);
console.log(`no_contraction_pages=${rows.filter((row) => row.contractions < 1).length}`);
console.log("");
console.log("| Page | You | Contractions | Questions | Local refs | Avg sentence | Short | Long | Human block | Generic hero |");
console.log("| --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: | --- | --- |");
for (const row of rows) {
  console.log(`| ${row.file} | ${row.you} | ${row.contractions} | ${row.questions} | ${row.localRefs} | ${row.avgSentenceWords} | ${row.shortSentences} | ${row.longSentences} | ${row.humanBlock ? "yes" : "no"} | ${row.genericHero ? "yes" : "no"} |`);
}

if (failures.length) {
  console.error(failures.join("\n"));
  process.exit(1);
}
