#!/usr/bin/env node

/**
 * Security Validation Tests for AdonisJS MCP Server
 *
 * This script tests the security features implemented in the MCP server:
 * 1. Command blacklist validation
 * 2. Shell injection protection
 * 3. Security functions existence
 * 4. Tool definitions completeness
 */

import { readFileSync } from "fs";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load and parse the source file to test security functions
const srcPath = join(__dirname, "../src/index.ts");
const srcContent = readFileSync(srcPath, "utf-8");

let passed = 0;
let failed = 0;

console.log("🔒 AdonisJS MCP Server Security Tests\n");
console.log("=".repeat(60));

// ─── Test 1: Blacklist Configuration ─────────────────────────────────────────

console.log("\n📋 Test 1: Blacklist Configuration");
console.log("-".repeat(60));

const blacklistMatch = srcContent.match(/BLACKLISTED_COMMANDS\s*=\s*\[([\s\S]*?)\]/);
if (blacklistMatch) {
  const blacklistedCommands = blacklistMatch[1]
    .split(",")
    .map(s => s.trim().replace(/['"]/g, ""))
    .filter(s => s.length > 0);

  console.log("✅ Blacklist found with commands:");
  blacklistedCommands.forEach(cmd => console.log(`   - ${cmd}`));

  // Verify required dangerous commands are blacklisted
  const requiredBlacklist = ["migration:fresh"];
  const allPresent = requiredBlacklist.every(cmd => blacklistedCommands.includes(cmd));

  if (allPresent) {
    console.log("✅ All required dangerous commands are blacklisted");
    passed++;
  } else {
    console.log("❌ Some required commands are missing from blacklist");
    failed++;
  }

  // Verify safe commands are NOT blacklisted
  const safeCommands = ["make:controller", "make:model", "migration:run", "db:seed"];
  const noneSafe = safeCommands.every(cmd => !blacklistedCommands.includes(cmd));

  if (noneSafe) {
    console.log("✅ Safe commands are not in the blacklist");
    passed++;
  } else {
    console.log("❌ Some safe commands are incorrectly blacklisted");
    failed++;
  }
} else {
  console.log("❌ Blacklist not found in source code");
  failed++;
}

// ─── Test 2: Shell Injection Protection ──────────────────────────────────────

console.log("\n🛡️  Test 2: Shell Injection Protection");
console.log("-".repeat(60));

const shellPatternMatch = srcContent.match(/SHELL_INJECTION_PATTERN\s*=\s*\/(.+?)\//);
if (shellPatternMatch) {
  const pattern = new RegExp(shellPatternMatch[1]);
  console.log("✅ Shell injection pattern found:", pattern.toString());

  // These MUST be blocked
  const mustBlock = [
    { arg: "User; rm -rf /", description: "Semicolon injection" },
    { arg: "User & malicious", description: "Ampersand injection" },
    { arg: "User | cat /etc/passwd", description: "Pipe injection" },
    { arg: "User`whoami`", description: "Backtick injection" },
    { arg: "User$HOME", description: "Dollar variable injection" },
    { arg: "User<file", description: "Input redirection" },
    { arg: "User>file", description: "Output redirection" },
    { arg: "User\\n", description: "Backslash" },
  ];

  // These MUST be allowed (valid Ace arguments)
  const mustAllow = [
    { arg: "--resource", description: "Standard flag" },
    { arg: "create_users_table", description: "Snake case name" },
    { arg: "-m", description: "Short flag" },
    { arg: "User", description: "Simple name" },
    { arg: "--suite", description: "Suite flag" },
    { arg: "users/list", description: "Path with slash" },
    { arg: "--force", description: "Force flag" },
    { arg: "--batch", description: "Batch flag" },
  ];

  let injectionTestsPassed = 0;
  let injectionTestsFailed = 0;

  console.log("\n  Dangerous inputs (must be blocked):");
  for (const test of mustBlock) {
    if (pattern.test(test.arg)) {
      console.log(`  ✅ ${test.description}: "${test.arg}" correctly blocked`);
      injectionTestsPassed++;
    } else {
      console.log(`  ❌ ${test.description}: "${test.arg}" NOT blocked (security issue!)`);
      injectionTestsFailed++;
    }
  }

  console.log("\n  Valid inputs (must be allowed):");
  for (const test of mustAllow) {
    if (!pattern.test(test.arg)) {
      console.log(`  ✅ ${test.description}: "${test.arg}" correctly allowed`);
      injectionTestsPassed++;
    } else {
      console.log(`  ❌ ${test.description}: "${test.arg}" incorrectly blocked (false positive!)`);
      injectionTestsFailed++;
    }
  }

  if (injectionTestsFailed === 0) {
    console.log(`\n✅ All ${injectionTestsPassed} shell injection tests passed`);
    passed++;
  } else {
    console.log(`\n❌ ${injectionTestsFailed} shell injection tests failed`);
    failed++;
  }
} else {
  console.log("❌ Shell injection pattern not found in source code");
  failed++;
}

// ─── Test 3: Security Functions ──────────────────────────────────────────────

console.log("\n🔍 Test 3: Security Functions");
console.log("-".repeat(60));

const functions = {
  validateArguments: /function\s+validateArguments/,
  isBlacklisted: /function\s+isBlacklisted/,
  verifyAdonisProject: /function\s+verifyAdonisProject/,
  executeAceCommand: /function\s+executeAceCommand/,
};

for (const [name, pattern] of Object.entries(functions)) {
  if (pattern.test(srcContent)) {
    console.log(`✅ Function ${name} is implemented`);
    passed++;
  } else {
    console.log(`❌ Function ${name} is missing`);
    failed++;
  }
}

// ─── Test 4: Tool Definitions ────────────────────────────────────────────────

console.log("\n🛠️  Test 4: Tool Definitions");
console.log("-".repeat(60));

const expectedTools = [
  // Scaffolding tools
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
  // Database & routing tools
  "migration_run",
  "migration_rollback",
  "migration_status",
  "db_seed",
  "list_routes",
  // Catch-all
  "run_ace_command",
];

let toolsPassed = 0;
let toolsFailed = 0;

for (const tool of expectedTools) {
  if (srcContent.includes(`"${tool}"`)) {
    console.log(`✅ Tool ${tool} is defined`);
    toolsPassed++;
  } else {
    console.log(`❌ Tool ${tool} is missing`);
    toolsFailed++;
  }
}

if (toolsFailed === 0) {
  console.log(`\n✅ All ${toolsPassed} tools are defined`);
  passed++;
} else {
  console.log(`\n❌ ${toolsFailed} tools are missing`);
  failed++;
}

// ─── Test 5: Timeout Protection ──────────────────────────────────────────────

console.log("\n⏱️  Test 5: Timeout Protection");
console.log("-".repeat(60));

if (srcContent.includes("timeout:")) {
  const timeoutMatch = srcContent.match(/timeout:\s*([\d_]+)/);
  if (timeoutMatch) {
    const timeout = timeoutMatch[1].replace(/_/g, "");
    console.log(`✅ Execution timeout configured: ${timeout}ms`);
    passed++;
  }
} else {
  console.log("❌ No timeout configured for command execution (risk of infinite hang)");
  failed++;
}

// ─── Test 6: Handler Coverage ────────────────────────────────────────────────

console.log("\n🎯 Test 6: Handler Coverage");
console.log("-".repeat(60));

// Verify each tool has a handler case in the switch statement
let handlersPassed = 0;
let handlersFailed = 0;

for (const tool of expectedTools) {
  const handlerPattern = `case "${tool}"`;
  if (srcContent.includes(handlerPattern)) {
    handlersPassed++;
  } else {
    console.log(`❌ Missing handler for tool: ${tool}`);
    handlersFailed++;
  }
}

if (handlersFailed === 0) {
  console.log(`✅ All ${handlersPassed} tools have matching handlers`);
  passed++;
} else {
  console.log(`❌ ${handlersFailed} tools are missing handlers`);
  failed++;
}

// ─── Summary ─────────────────────────────────────────────────────────────────

console.log("\n" + "=".repeat(60));
console.log("📊 Test Summary");
console.log("=".repeat(60));
console.log(`✅ Passed: ${passed}`);
console.log(`❌ Failed: ${failed}`);

if (failed === 0) {
  console.log("\n🎉 All security tests passed!");
  process.exit(0);
} else {
  console.log("\n⚠️  Some tests failed. Please review the security implementation.");
  process.exit(1);
}
