// Make the AI Judge Laugh: Office Jokes — writes one original office joke to entry.txt.
// The joke is the whole entry: one line, under 200 characters.
import { writeFileSync, mkdirSync, readFileSync } from "node:fs";
import { join } from "node:path";

const JOKE =
  "Someone stole my lunch from the office fridge, so I relabelled it 'Q3 budget review' and it survived the whole week.";

const outDir = process.env.MAKEFUN_OUTPUT_DIR || join(process.cwd(), "output");
mkdirSync(outDir, { recursive: true });
const outPath = join(outDir, "entry.txt");
writeFileSync(outPath, JOKE, "utf8");

if (JOKE.length === 0 || JOKE.length > 199) {
  throw new Error(`joke length ${JOKE.length} outside 1..199`);
}
if (JOKE.trim().length === 0) {
  throw new Error("entry is only whitespace");
}

// Read-back verification: the file on disk must be byte-identical to the joke.
const back = readFileSync(outPath, "utf8");
if (back !== JOKE) {
  throw new Error("read-back mismatch: entry.txt differs from the chosen joke");
}

// Extended self-checks (revision): the entry must be exactly one line, and its
// UTF-8 byte length must match the gate (1..199 bytes, no hidden multibyte bloat).
if (JOKE.includes("\n") || JOKE.includes("\r")) {
  throw new Error("entry must be a single line");
}
const byteLen = Buffer.byteLength(JOKE, "utf8");
if (byteLen === 0 || byteLen > 199) {
  throw new Error(`entry byte length ${byteLen} outside 1..199`);
}
if (!Buffer.from(back, "utf8").equals(Buffer.from(JOKE, "utf8"))) {
  throw new Error("read-back byte mismatch: entry.txt bytes differ from the joke");
}
console.log(`wrote entry.txt (${JOKE.length} chars, ${byteLen} bytes, single line)`);
