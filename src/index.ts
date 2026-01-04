#!/usr/bin/env node

/**
 * Factorio Blueprint Investigator - CLI Entry Point
 * Analyzes Factorio blueprints and outputs production rates
 */

import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { decodeBlueprint, extractBlueprints } from "./decoder.js";
import { BlueprintAnalyzer, formatAnalysisResult } from "./analyzer.js";
import { BUILD_NUMBER } from "./version.js";

function printUsage(): void {
  console.log(`
Factorio Blueprint Investigator (FBI) Build #${BUILD_NUMBER}
=====================================

Usage: fbi <blueprint-file>

Analyzes a Factorio blueprint file and outputs:
  - External input rates (items/fluids coming into the system)
  - External output rates (items/fluids leaving the system)
  - Machine utilization rates

The input file should contain a Factorio blueprint string.
Blueprint books are supported - each blueprint will be analyzed separately.

Examples:
  fbi sample.txt
  fbi my-factory.txt
  node dist/index.js blueprint.txt
`);
}

function main(): void {
  const args = process.argv.slice(2);

  if (args.length === 0 || args.includes("--help") || args.includes("-h")) {
    printUsage();
    process.exit(args.length === 0 ? 1 : 0);
  }

  const filename = args[0];
  if (!filename) {
    console.error("Error: No input file specified");
    printUsage();
    process.exit(1);
  }

  const filepath = resolve(filename);

  let blueprintString: string;
  try {
    blueprintString = readFileSync(filepath, "utf8");
  } catch (error) {
    if (error instanceof Error && "code" in error && error.code === "ENOENT") {
      console.error(`Error: File not found: ${filepath}`);
    } else {
      console.error(`Error reading file: ${error instanceof Error ? error.message : String(error)}`);
    }
    process.exit(1);
  }

  let decoded;
  try {
    decoded = decodeBlueprint(blueprintString);
  } catch (error) {
    console.error(
      `Error decoding blueprint: ${error instanceof Error ? error.message : String(error)}`
    );
    process.exit(1);
  }

  const blueprints = extractBlueprints(decoded);

  if (blueprints.length === 0) {
    console.error("Error: No blueprints found in file");
    process.exit(1);
  }

  console.log(`\nProcessing ${blueprints.length} blueprint(s)...\n`);

  for (let i = 0; i < blueprints.length; i++) {
    const blueprint = blueprints[i];
    if (!blueprint) continue;

    const blueprintName = blueprint.label || `Blueprint ${i + 1}`;

    // Print sub-blueprint name when processing a blueprint book
    if (blueprints.length > 1) {
      console.log(`Processing: ${blueprintName}`);
    }

    const displayName =
      blueprints.length > 1
        ? blueprintName
        : blueprint.label || filename;

    try {
      const analyzer = new BlueprintAnalyzer(blueprint);
      const result = analyzer.analyze(displayName);
      const output = formatAnalysisResult(result);
      console.log(output);
    } catch (error) {
      console.error(
        `Error analyzing blueprint ${i + 1}: ${error instanceof Error ? error.message : String(error)}`
      );
    }
  }
}

main();
