#!/usr/bin/env node

/**
 * Security Validation Tests for AdonisJS MCP Server
 * 
 * This script tests the security features implemented in the MCP server:
 * 1. Command blacklist validation
 * 2. Shell injection protection
 */

import { execSync } from "child_process";
import { readFileSync } from "fs";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load and parse the source file to test security functions
const srcPath = join(__dirname, "../src/index.ts");
const srcContent = readFileSync(srcPath, "utf-8");

// Test cases
const tests = {
  blacklist: [
    { command: "db:wipe", shouldFail: true, description: "db:wipe is blacklisted" },
    { command: "migration:fresh", shouldFail: true, description: "migration:fresh is blacklisted" },
    { command: "migration:refresh", shouldFail: true, description: "migration:refresh is blacklisted" },
    { command: "migration:reset", shouldFail: true, description: "migration:reset is blacklisted" },
    { command: "make:controller", shouldFail: false, description: "make:controller is allowed" },
  ],
  shellInjection: [
    { arg: "User; rm -rf /", description: "Semicolon injection" },
    { arg: "User & malicious", description: "Ampersand injection" },
    { arg: "User | cat /etc/passwd", description: "Pipe injection" },
    { arg: "User`whoami`", description: "Backtick injection" },
    { arg: "User$(whoami)", description: "Command substitution" },
    { arg: "User{a,b}", description: "Brace expansion" },
    { arg: "User<file", description: "Input redirection" },
    { arg: "User>file", description: "Output redirection" },
    { arg: "User\\n", description: "Backslash" },
  ],
};

let passed = 0;
let failed = 0;

console.log("🔒 AdonisJS MCP Server Security Tests\n");
console.log("=" .repeat(60));

// Test 1: Verify blacklist is defined
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
  
  // Verify all required commands are blacklisted
  const requiredBlacklist = ["db:wipe", "migration:fresh", "migration:refresh", "migration:reset"];
  const allPresent = requiredBlacklist.every(cmd => blacklistedCommands.includes(cmd));
  
  if (allPresent) {
    console.log("✅ All required dangerous commands are blacklisted");
    passed++;
  } else {
    console.log("❌ Some required commands are missing from blacklist");
    failed++;
  }
} else {
  console.log("❌ Blacklist not found in source code");
  failed++;
}

// Test 2: Verify shell injection protection
console.log("\n🛡️  Test 2: Shell Injection Protection");
console.log("-".repeat(60));

const shellPatternMatch = srcContent.match(/SHELL_INJECTION_PATTERN\s*=\s*\/(.+?)\//);
if (shellPatternMatch) {
  const pattern = new RegExp(shellPatternMatch[1]);
  console.log("✅ Shell injection pattern found:", pattern.toString());
  
  let injectionTestsPassed = 0;
  let injectionTestsFailed = 0;
  
  for (const test of tests.shellInjection) {
    if (pattern.test(test.arg)) {
      console.log(`✅ ${test.description}: "${test.arg}" correctly blocked`);
      injectionTestsPassed++;
    } else {
      console.log(`❌ ${test.description}: "${test.arg}" NOT blocked (security issue!)`);
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

// Test 3: Verify security functions exist
console.log("\n🔍 Test 3: Security Functions");
console.log("-".repeat(60));

const functions = {
  validateArguments: /function\s+validateArguments/,
  isBlacklisted: /function\s+isBlacklisted/,
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

// Test 4: Verify tools are properly defined
console.log("\n🛠️  Test 4: Tool Definitions");
console.log("-".repeat(60));

const tools = ["make_controller", "make_service", "run_ace_command"];
let toolsPassed = 0;
let toolsFailed = 0;

for (const tool of tools) {
  if (srcContent.includes(`"${tool}"`)) {
    console.log(`✅ Tool ${tool} is defined`);
    toolsPassed++;
  } else {
    console.log(`❌ Tool ${tool} is missing`);
    toolsFailed++;
  }
}

if (toolsFailed === 0) {
  passed++;
} else {
  failed++;
}

// Summary
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
