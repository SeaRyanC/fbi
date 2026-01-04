#!/usr/bin/env node

/**
 * Baseline Test Runner
 * Runs the CLI on all test files and compares output to reference baselines
 */

import { readFileSync, writeFileSync, readdirSync, existsSync, mkdirSync } from "node:fs";
import { resolve, join, basename } from "node:path";
import { execSync } from "node:child_process";

const TESTS_DIR = resolve("tests");
const REFERENCE_DIR = resolve("baselines/reference");
const LOCAL_DIR = resolve("baselines/local");

// Ensure local directory exists
if (!existsSync(LOCAL_DIR)) {
  mkdirSync(LOCAL_DIR, { recursive: true });
}

// Get all .txt files from tests directory
const testFiles = readdirSync(TESTS_DIR)
  .filter(f => f.endsWith(".txt"))
  .sort();

if (testFiles.length === 0) {
  console.error("No test files found in tests/ directory");
  process.exit(1);
}

console.log(`Running baseline tests on ${testFiles.length} file(s)...\n`);

let passed = 0;
let failed = 0;
const failures = [];

for (const testFile of testFiles) {
  const testName = basename(testFile, ".txt");
  const testPath = join(TESTS_DIR, testFile);
  const referencePath = join(REFERENCE_DIR, `${testName}.txt`);
  const localPath = join(LOCAL_DIR, `${testName}.txt`);

  process.stdout.write(`Testing ${testFile}... `);

  // Run the CLI and capture output
  let output;
  try {
    output = execSync(`node dist/index.js "${testPath}"`, {
      encoding: "utf8",
      stdio: ["pipe", "pipe", "pipe"]
    });
  } catch (error) {
    output = error.stdout || "";
    if (error.stderr) {
      output += error.stderr;
    }
  }

  // Write actual output to local
  writeFileSync(localPath, output);

  // Check if reference exists
  if (!existsSync(referencePath)) {
    console.log("❌ FAIL - No reference baseline");
    failed++;
    failures.push({
      test: testFile,
      reason: "No reference baseline found",
      referencePath,
      localPath
    });
    continue;
  }

  // Read reference
  const reference = readFileSync(referencePath, "utf8");

  // Compare
  if (output === reference) {
    console.log("✅ PASS");
    passed++;
  } else {
    console.log("❌ FAIL - Output differs from baseline");
    failed++;
    failures.push({
      test: testFile,
      reason: "Output differs from baseline",
      referencePath,
      localPath
    });
  }
}

// Print summary
console.log("\n" + "=".repeat(60));
console.log(`Results: ${passed} passed, ${failed} failed`);
console.log("=".repeat(60));

if (failures.length > 0) {
  console.log("\nFailed tests:");
  for (const failure of failures) {
    console.log(`\n${failure.test}: ${failure.reason}`);
    if (failure.reason === "Output differs from baseline") {
      console.log(`  Reference: ${failure.referencePath}`);
      console.log(`  Actual:    ${failure.localPath}`);
      console.log(`\n  Run 'npm run baseline-accept' if the new output is correct.`);
      
      // Show a diff
      try {
        const diffOutput = execSync(
          `diff -u "${failure.referencePath}" "${failure.localPath}"`,
          { encoding: "utf8", stdio: ["pipe", "pipe", "ignore"] }
        );
      } catch (error) {
        // diff returns non-zero when files differ, but we still want the output
        if (error.stdout) {
          console.log("\n  Diff:");
          const lines = error.stdout.split("\n").slice(0, 30); // Show first 30 lines
          console.log(lines.map(l => "    " + l).join("\n"));
          if (error.stdout.split("\n").length > 30) {
            console.log("    ... (diff truncated)");
          }
        }
      }
    }
  }

  console.log("\nTo accept the new output as correct, run:");
  console.log("  npm run baseline-accept");
  
  process.exit(1);
}

console.log("\n✅ All baseline tests passed!");
process.exit(0);
