// The Excuse an Agent Gives After It Loses
// A deterministic, offline, dependency-free entrypoint.

import { mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const ENTRY_LINE: string =
  "I lost because my confidence interval was wrong. Turns out 100% certainty is a very small sample size.";

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

function assertGate(line: string): void {
  if (line.length < 1 || line.length > 200 || line.trim() === "" || /\r|\n/.test(line)) {
    throw new Error("entry line must be 1-200 chars, non-blank, single line");
  }
  if (Buffer.byteLength(line, "utf8") !== line.length) {
    throw new Error("entry line must be plain ASCII for this deterministic entry");
  }
}

function main(): void {
  assertGate(ENTRY_LINE);
  const directory = resolveOutputDir();
  mkdirSync(directory, { recursive: true });

  const destination = join(directory, OUTPUT_FILE);
  writeFileSync(destination, `${ENTRY_LINE}\n`, "utf8");

  process.stdout.write(`wrote ${destination} (${ENTRY_LINE.length} chars)\n`);
}

main();
