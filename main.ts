// Entry point for the news-image-20261127 bounty.
//
// Copies the front-page image (entry.png, rendered from page.html with
// headless Chromium) into the grader's output directory. No network, no
// clock, no randomness: the same input bytes always produce the same
// output bytes.
import { chmodSync, copyFileSync, mkdirSync, statSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const repoRoot = dirname(fileURLToPath(import.meta.url));
const outputDir = process.env.MAKEFUN_OUTPUT_DIR ?? "/output";

mkdirSync(outputDir, { recursive: true });

const source = join(repoRoot, "entry.png");
const destination = join(outputDir, "entry.png");
copyFileSync(source, destination);
chmodSync(destination, 0o644);

// Fail loudly instead of shipping a truncated or corrupt copy.
const written = statSync(destination).size;
if (written !== statSync(source).size) {
  throw new Error(`entry.png copy size mismatch: ${destination}`);
}

// The gate reads the file by its first bytes: refuse to ship anything
// that is not a PNG.
import { readFileSync } from "node:fs";
const magic = readFileSync(destination).subarray(0, 8);
const pngMagic = Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]);
if (!magic.equals(pngMagic)) {
  throw new Error(`entry.png is not a PNG: ${destination}`);
}
console.log(`wrote ${destination} (${written} bytes)`);
