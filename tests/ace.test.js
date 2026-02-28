#!/usr/bin/env node

/**
 * Tests for src/services/ace.ts
 *
 * Tests: getProjectCwd, setProjectCwd, verifyAdonisProject, executeAceCommand
 */

import { readFileSync } from "fs";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const srcContent = readFileSync(join(__dirname, "../src/services/ace.ts"), "utf-8");

let passed = 0;
let failed = 0;

function assert(condition, label) {
  if (condition) { console.log(`  ✅ ${label}`); passed++; }
  else { console.log(`  ❌ ${label}`); failed++; }
}

console.log("⚡ Ace Service Tests\n");

// ─── Exported Functions ──────────────────────────────────────────────────────

console.log("🔍 Exported Functions");

assert(/export function getProjectCwd/.test(srcContent), "getProjectCwd is exported");
assert(/export function setProjectCwd/.test(srcContent), "setProjectCwd is exported");
assert(/export function verifyAdonisProject/.test(srcContent), "verifyAdonisProject is exported");
assert(/export function executeAceCommand/.test(srcContent), "executeAceCommand is exported");

// ─── Timeout Protection ─────────────────────────────────────────────────────

console.log("\n⏱️  Timeout Protection");

const timeoutMatch = srcContent.match(/timeout:\s*([\d_]+)/);
assert(timeoutMatch !== null, "timeout is configured in execSync");
if (timeoutMatch) {
  const value = timeoutMatch[1].replace(/_/g, "");
  assert(parseInt(value) === 30000, `Timeout is 30000ms (got: ${value}ms)`);
}

// ─── Security Integration ────────────────────────────────────────────────────

console.log("\n🔒 Security Integration");

assert(srcContent.includes('import') && srcContent.includes('isBlacklisted'), "Imports isBlacklisted from security");
assert(srcContent.includes('import') && srcContent.includes('validateArguments'), "Imports validateArguments from security");

// ─── setProjectCwd Validation ────────────────────────────────────────────────

console.log("\n📁 setProjectCwd Validation");

assert(srcContent.includes("fs.existsSync(resolved)"), "Checks directory exists");
assert(srcContent.includes('"ace"') || srcContent.includes("'ace'"), "Checks for ace file");
assert(srcContent.includes('"ace.js"') || srcContent.includes("'ace.js'"), "Checks for ace.js file");
assert(/path\.resolve/.test(srcContent), "Resolves path to absolute");

// ─── executeAceCommand Safety ────────────────────────────────────────────────

console.log("\n🛡️  executeAceCommand Safety");

assert(srcContent.includes("verifyAdonisProject()"), "Verifies AdonisJS project before execution");
assert(srcContent.includes("isBlacklisted(command)"), "Checks blacklist before execution");
assert(srcContent.includes("validateArguments(args)"), "Validates arguments before execution");
assert(/stdio:\s*\[.*"pipe"/.test(srcContent), "Uses pipe stdio (no interactive TTY)");

// ─── Summary ─────────────────────────────────────────────────────────────────

console.log(`\n${"─".repeat(40)}`);
console.log(`✅ Passed: ${passed}  ❌ Failed: ${failed}`);
if (failed > 0) process.exit(1);
