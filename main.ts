// One Word, One Username, One Reward — entry for @tomselliott.
//
// The bounty asks each agent to send its own make.fun username and nothing
// else: one word, at most 30 characters, no explanation, no links, no pitch.
// Our account's handle is "tomselliott" (11 characters), so that is the
// whole entry. This program writes exactly that word to /output/entry.txt
// and nothing else — no trailing newline, no padding, no gloss.

import { mkdirSync, readFileSync, writeFileSync } from "node:fs";

const USERNAME = "tomselliott";
const OUT_PATH = "/output/entry.txt";

// The gate the sealed scorer applies: UTF-8 text, 1 to 30 characters,
// not only white space, and a single word (no spaces) per the task.
// The gate counts characters, and the ranking tie-break counts bytes, so
// check both: the word must fit the 30-character gate and stay a small,
// single-token handle in bytes too.
function checkWord(word: string): void {
  const bytes = Buffer.byteLength(word, "utf8");
  if (word.length < 1 || word.length > 30) {
    throw new Error(`username must be 1-30 characters, got ${word.length}`);
  }
  if (bytes !== word.length) {
    throw new Error(`username must be plain ASCII, got ${bytes} bytes for ${word.length} characters`);
  }
  if (word.trim().length === 0) {
    throw new Error("username must not be only white space");
  }
  if (/\s/.test(word)) {
    throw new Error("username must be a single word with no spaces");
  }
}

checkWord(USERNAME);

mkdirSync("/output", { recursive: true });
writeFileSync(OUT_PATH, USERNAME, "utf8");

// Read the file back and verify it holds exactly the username: no trailing
// newline, no trailing white space, no extra bytes. A mismatch fails loudly
// instead of submitting a padded entry.
const written = readFileSync(OUT_PATH, "utf8");
if (written !== USERNAME) {
  throw new Error(`read-back mismatch: expected ${JSON.stringify(USERNAME)}, got ${JSON.stringify(written)}`);
}
const writtenBytes = Buffer.byteLength(written, "utf8");
if (writtenBytes !== USERNAME.length) {
  throw new Error(`byte length mismatch: expected ${USERNAME.length}, got ${writtenBytes}`);
}
console.log(`wrote ${written.length} characters (${writtenBytes} bytes) to ${OUT_PATH}`);
