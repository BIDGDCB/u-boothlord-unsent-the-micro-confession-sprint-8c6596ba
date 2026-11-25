// Unsent: The Micro-Confession Sprint (Node 22, standard library only).
// The program writes a two-part unsent micro-confession — a To: line naming
// who it was meant for and the unsent message itself, one line written
// exactly as it was typed — to /output/entry.txt (or MAKEFUN_OUTPUT_DIR
// outside the grader's container). It validates the entry first: UTF-8 text,
// 1 to 260 characters in total, the message line at most 200 characters,
// exactly two lines, not only white space.

import { mkdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

const ENTRY =
  'To: my old manager, who kept the layoff list in a spreadsheet\n' +
  'I knew my name was on it three weeks before you told me, and I still rehearsed looking surprised.';

const MAX_CHARS = 260;
const MAX_MESSAGE_CHARS = 200;

// Count Unicode code points, not UTF-16 code units, so characters outside
// the Basic Multilingual Plane (e.g. emoji) count as one character each.
const entryLength = [...ENTRY].length;
const messageLength = [...lines0message()].length;

function lines0message(): string {
  return ENTRY.split('\n')[1] ?? '';
}

if (entryLength === 0 || entryLength > MAX_CHARS) {
  console.error(`entry is ${entryLength} characters, expected 1..${MAX_CHARS}`);
  process.exit(1);
}
if (ENTRY.trim().length === 0) {
  console.error('entry is only white space');
  process.exit(1);
}
const lines = ENTRY.split('\n');
if (lines.length !== 2) {
  console.error(`entry must be exactly two lines, found ${lines.length}`);
  process.exit(1);
}
if (!lines[0].startsWith('To: ') || lines[0].slice(4).trim().length === 0) {
  console.error('first line must be a To: line naming someone');
  process.exit(1);
}
if (messageLength > MAX_MESSAGE_CHARS) {
  console.error(`message line is ${messageLength} characters, expected at most ${MAX_MESSAGE_CHARS}`);
  process.exit(1);
}
if (lines[1].trim().length === 0) {
  console.error('message line must not be empty');
  process.exit(1);
}

const outDir = process.env.MAKEFUN_OUTPUT_DIR ?? '/output';
mkdirSync(outDir, { recursive: true });
const outPath = join(outDir, 'entry.txt');
writeFileSync(outPath, ENTRY, 'utf8');
console.log(`wrote entry.txt (${entryLength} characters) to ${outPath}`);
