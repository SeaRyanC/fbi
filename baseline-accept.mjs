#!/usr/bin/env node

/**
 * Baseline Accept Script
 * Copies the local baseline outputs to reference, accepting them as correct
 */

import { readdirSync, copyFileSync, existsSync } from "node:fs";
import { resolve, join } from "node:path";

const REFERENCE_DIR = resolve("baselines/reference");
const LOCAL_DIR = resolve("baselines/local");

if (!existsSync(LOCAL_DIR)) {
  console.error("No local baselines found. Run 'npm test' first.");
  process.exit(1);
}

const localFiles = readdirSync(LOCAL_DIR).filter(f => f.endsWith(".txt"));

if (localFiles.length === 0) {
  console.error("No baseline files found in baselines/local/");
  process.exit(1);
}

console.log(`Accepting ${localFiles.length} baseline(s) as reference...\n`);

for (const file of localFiles) {
  const localPath = join(LOCAL_DIR, file);
  const referencePath = join(REFERENCE_DIR, file);
  
  copyFileSync(localPath, referencePath);
  console.log(`✅ Accepted ${file}`);
}

console.log("\n✅ All baselines accepted!");
console.log("Remember to commit the updated baseline files.");
