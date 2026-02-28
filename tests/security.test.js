#!/usr/bin/env node

/**
 * Tests for src/services/security.ts
 *
 * Tests: BLACKLISTED_COMMANDS, SHELL_INJECTION_PATTERN, validateArguments, isBlacklisted
 */

import { readFileSync } from "fs";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const srcContent = readFileSync(join(__dirname, "../src/services/security.ts"), "utf-8");

let passed = 0;
let failed = 0;

function assert(condition, label) {
  if (condition) { console.log(`  ✅ ${label}`); passed++; }
  else { console.log(`  ❌ ${label}`); failed++; }
}

console.log("🔒 Security Module Tests\n");

// ─── Blacklist ───────────────────────────────────────────────────────────────

console.log("📋 Blacklist Configuration");

const blacklistMatch = srcContent.match(/BLACKLISTED_COMMANDS\s*=\s*\[([\s\S]*?)\]/);
const blacklistedCommands = blacklistMatch
  ? blacklistMatch[1].split(",").map(s => s.trim().replace(/['"]/g, "")).filter(s => s.length > 0)
  : [];

assert(blacklistedCommands.includes("migration:fresh"), "migration:fresh is blacklisted");
assert(!blacklistedCommands.includes("make:controller"), "make:controller is NOT blacklisted");
assert(!blacklistedCommands.includes("make:model"), "make:model is NOT blacklisted");
assert(!blacklistedCommands.includes("migration:run"), "migration:run is NOT blacklisted");
assert(!blacklistedCommands.includes("db:seed"), "db:seed is NOT blacklisted");

// ─── Shell Injection Pattern ─────────────────────────────────────────────────

console.log("\n🛡️  Shell Injection Pattern");

const shellPatternMatch = srcContent.match(/SHELL_INJECTION_PATTERN\s*=\s*\/(.+?)\//);
assert(shellPatternMatch !== null, "SHELL_INJECTION_PATTERN is defined");

if (shellPatternMatch) {
  const pattern = new RegExp(shellPatternMatch[1]);

  console.log("\n  Must BLOCK:");
  const mustBlock = [
    ["User; rm -rf /", "semicolon"],
    ["User & malicious", "ampersand"],
    ["User | cat /etc/passwd", "pipe"],
    ["User`whoami`", "backtick"],
    ["User$HOME", "dollar sign"],
    ["User<file", "input redirect"],
    ["User>file", "output redirect"],
    ["User\\n", "backslash"],
  ];
  for (const [input, label] of mustBlock) {
    assert(pattern.test(input), `Blocks ${label}: "${input}"`);
  }

  console.log("\n  Must ALLOW:");
  const mustAllow = [
    ["--resource", "standard flag"],
    ["create_users_table", "snake_case name"],
    ["-m", "short flag"],
    ["User", "simple name"],
    ["users/list", "path with slash"],
    ["--force", "force flag"],
    ["--batch", "batch flag"],
    ["UserController", "PascalCase name"],
  ];
  for (const [input, label] of mustAllow) {
    assert(!pattern.test(input), `Allows ${label}: "${input}"`);
  }
}

// ─── Exported Functions ──────────────────────────────────────────────────────

console.log("\n🔍 Exported Functions");

assert(/export function validateArguments/.test(srcContent), "validateArguments is exported");
assert(/export function isBlacklisted/.test(srcContent), "isBlacklisted is exported");
assert(/export const BLACKLISTED_COMMANDS/.test(srcContent), "BLACKLISTED_COMMANDS is exported");
assert(/export const SHELL_INJECTION_PATTERN/.test(srcContent), "SHELL_INJECTION_PATTERN is exported");

// ─── Summary ─────────────────────────────────────────────────────────────────

console.log(`\n${"─".repeat(40)}`);
console.log(`✅ Passed: ${passed}  ❌ Failed: ${failed}`);
if (failed > 0) process.exit(1);
