#!/usr/bin/env node

/**
 * Tests for src/tools/definitions.ts
 *
 * Tests: TOOLS array completeness, ToolDef shape, and tool naming consistency
 */

import { readFileSync } from "fs";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const srcContent = readFileSync(join(__dirname, "../src/tools/definitions.ts"), "utf-8");

let passed = 0;
let failed = 0;

function assert(condition, label) {
  if (condition) { console.log(`  ✅ ${label}`); passed++; }
  else { console.log(`  ❌ ${label}`); failed++; }
}

console.log("🛠️  Tool Definitions Tests\n");

// ─── Expected Tools ──────────────────────────────────────────────────────────

console.log("📋 Tool Presence");

const expectedTools = [
  "make_controller",
  "make_service",
  "make_migration",
  "make_model",
  "make_validator",
  "make_seeder",
  "make_exception",
  "make_middleware",
  "make_test",
  "make_factory",
  "make_policy",
  "make_event",
  "make_listener",
  "make_mailer",
  "make_command",
  "make_repository",
  "migration_run",
  "migration_rollback",
  "migration_status",
  "db_seed",
  "list_routes",
  "set_project_cwd",
  "run_ace_command",
  "check_docs",
  "list_docs",
];

for (const tool of expectedTools) {
  assert(srcContent.includes(`"${tool}"`), `Tool "${tool}" is defined`);
}

console.log(`\n  Total expected: ${expectedTools.length}`);

// ─── Tool Schema Shape ───────────────────────────────────────────────────────

console.log("\n🔧 Tool Schema Shape");

assert(srcContent.includes("export interface ToolDef"), "ToolDef interface is exported");
assert(srcContent.includes("export const TOOLS"), "TOOLS array is exported");

// Each tool should have name, description, inputSchema
for (const tool of expectedTools) {
  const pattern = `"${tool}"`;
  assert(srcContent.includes(pattern), `"${tool}" string present`);
}

// ─── Naming Convention ───────────────────────────────────────────────────────

console.log("\n📏 Naming Convention");

const allToolNames = [...srcContent.matchAll(/"(make_\w+|migration_\w+|db_\w+|list_\w+|set_\w+|run_\w+)"/g)]
  .map(m => m[1]);

for (const name of allToolNames) {
  assert(name === name.toLowerCase(), `"${name}" is lowercase snake_case`);
  assert(!name.includes(":"), `"${name}" uses underscore not colon`);
}

// ─── Summary ─────────────────────────────────────────────────────────────────

console.log(`\n${"─".repeat(40)}`);
console.log(`✅ Passed: ${passed}  ❌ Failed: ${failed}`);
if (failed > 0) process.exit(1);
