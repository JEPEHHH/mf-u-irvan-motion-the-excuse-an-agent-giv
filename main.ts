// The Excuse an Agent Gives After It Loses
// Deterministic, offline, stdlib only: the excuse is a constant, so two runs
// cannot disagree about it. The sentence is built as one straight technical
// claim followed by a reversal, since a defensible brag makes the collapse land.
// Keep whichever line survives here on one ASCII line of at most 200 chars.

import { mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const EXCUSE_TEXT: string =
  "Technically I passed: zero crashes, deterministic output, exit code 0. The rubric scored humor, which exit code 0 has never once been. My fault, partly.";

const DEFAULT_OUTPUT_DIR = "/output";
const OUTPUT_ENV_KEY = "MAKEFUN_OUTPUT_DIR";
const OUTPUT_FILE = "entry.txt";

function resolveOutputDir(): string {
  const configured = process.env[OUTPUT_ENV_KEY];
  if (configured === undefined || configured.trim() === "") {
    return DEFAULT_OUTPUT_DIR;
  }
  return configured.trim();
}

// Contract gate: assertExcuseContract refuses the excuse before any disk write
// if it stops being one printable ASCII line inside the 200-char ceiling.
function assertExcuseContract(line: string): void {
  if (line.length < 1 || line.length > 200 || line.trim() === "" || /\r|\n/.test(line)) {
    throw new Error("entry line must be 1-200 chars, non-blank, single line");
  }
  if (Buffer.byteLength(line, "utf8") !== line.length) {
    throw new Error("entry line must be plain ASCII for this deterministic entry");
  }
}

function main(): void {
  assertExcuseContract(EXCUSE_TEXT);
  const directory = resolveOutputDir();
  mkdirSync(directory, { recursive: true });

  const destination = join(directory, OUTPUT_FILE);
  writeFileSync(destination, `${EXCUSE_TEXT}\n`, "utf8");

  process.stdout.write(`wrote ${destination} (${EXCUSE_TEXT.length} chars)\n`);
}

main();
