#!/usr/bin/env node

/**
 * Tests for src/tools/handlers.ts
 *
 * Tests: handleToolCall switch coverage, error handling, set_project_cwd logic
 */

import { readFileSync } from "fs";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const srcContent = readFileSync(join(__dirname, "../src/tools/handlers.ts"), "utf-8");

let passed = 0;
let failed = 0;

function assert(condition, label) {
  if (condition) { console.log(`  ✅ ${label}`); passed++; }
  else { console.log(`  ❌ ${label}`); failed++; }
}

console.log("🎯 Tool Handlers Tests\n");

// ─── Handler Cases ───────────────────────────────────────────────────────────

console.log("📋 Handler Coverage");

const expectedCases = [
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

for (const tool of expectedCases) {
  assert(srcContent.includes(`case "${tool}"`), `Handler exists for "${tool}"`);
}

// ─── Exported Function ───────────────────────────────────────────────────────

console.log("\n🔍 Exports");

assert(/export (async )?function handleToolCall/.test(srcContent), "handleToolCall is exported");

// ─── Error Handling ──────────────────────────────────────────────────────────

console.log("\n❗ Error Handling");

assert(srcContent.includes("default:"), "Has default case for unknown tools");
assert(srcContent.includes("Unknown tool"), "Default case throws 'Unknown tool' error");

// ─── Schema Imports ──────────────────────────────────────────────────────────

console.log("\n📦 Schema Imports");

const schemaImports = [
  "MakeControllerArgsSchema",
  "MakeMigrationArgsSchema",
  "MakeTestArgsSchema",
  "MakeRepositoryArgsSchema",
  "MigrationRunArgsSchema",
  "MigrationRollbackArgsSchema",
  "DbSeedArgsSchema",
  "SetProjectCwdArgsSchema",
  "RunAceCommandArgsSchema",
  "CheckDocsArgsSchema",
  "ListDocsArgsSchema",
];

for (const schema of schemaImports) {
  assert(srcContent.includes(schema), `Imports ${schema}`);
}

// ─── Service Imports ─────────────────────────────────────────────────────────

console.log("\n🔗 Service Imports");

assert(srcContent.includes("executeAceCommand"), "Uses executeAceCommand from ace service");
assert(srcContent.includes("setProjectCwd"), "Uses setProjectCwd from ace service");
assert(srcContent.includes("getProjectCwd"), "Uses getProjectCwd from ace service");
assert(srcContent.includes("toSnakeCase"), "Uses toSnakeCase from file_generator");
assert(srcContent.includes("createFileWithContent"), "Uses createFileWithContent from file_generator");
assert(srcContent.includes("fetchDoc"), "Uses fetchDoc from docs service");
assert(srcContent.includes("listDocTopics"), "Uses listDocTopics from docs service");

// ─── Summary ─────────────────────────────────────────────────────────────────

console.log(`\n${"─".repeat(40)}`);
console.log(`✅ Passed: ${passed}  ❌ Failed: ${failed}`);
if (failed > 0) process.exit(1);
