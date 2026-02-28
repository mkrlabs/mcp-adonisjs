#!/usr/bin/env node

/**
 * Tests for src/index.ts (entry point)
 *
 * Tests: shebang, server setup, imports, slim structure
 */

import { readFileSync } from "fs";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const srcContent = readFileSync(join(__dirname, "../src/index.ts"), "utf-8");

let passed = 0;
let failed = 0;

function assert(condition, label) {
  if (condition) { console.log(`  ✅ ${label}`); passed++; }
  else { console.log(`  ❌ ${label}`); failed++; }
}

console.log("🚀 Entry Point Tests\n");

// ─── Shebang ─────────────────────────────────────────────────────────────────

console.log("📦 Shebang");

assert(srcContent.startsWith("#!/usr/bin/env node"), "Source starts with shebang");

const buildPath = join(__dirname, "../build/index.js");
try {
  const buildContent = readFileSync(buildPath, "utf-8");
  assert(buildContent.startsWith("#!/usr/bin/env node"), "Build starts with shebang");
} catch {
  console.log("  ⚠️  Build file not found — run 'npm run build' first");
}

// ─── Module Imports ──────────────────────────────────────────────────────────

console.log("\n📥 Module Imports");

assert(srcContent.includes("./services/ace"), "Imports from services/ace");
assert(srcContent.includes("./tools/definitions"), "Imports from tools/definitions");
assert(srcContent.includes("./tools/handlers"), "Imports from tools/handlers");

// ─── MCP SDK Usage ───────────────────────────────────────────────────────────

console.log("\n🔌 MCP SDK");

assert(srcContent.includes("Server"), "Uses MCP Server");
assert(srcContent.includes("StdioServerTransport"), "Uses StdioServerTransport");
assert(srcContent.includes("ListToolsRequestSchema"), "Handles ListTools requests");
assert(srcContent.includes("CallToolRequestSchema"), "Handles CallTool requests");

// ─── Dynamic Version ────────────────────────────────────────────────────────

console.log("\n🏷️  Dynamic Version");

assert(srcContent.includes("PKG_VERSION"), "Uses PKG_VERSION from package.json");
assert(srcContent.includes("createRequire"), "Uses createRequire for JSON import");
assert(!/ version: ["']\d/.test(srcContent), "No hardcoded version string in Server()");

// ─── Slim Structure ─────────────────────────────────────────────────────────

console.log("\n📐 Slim Structure");

const lines = srcContent.split("\n").length;
assert(lines < 100, `Entry point is slim (${lines} lines < 100)`);

// ─── Error Handling ──────────────────────────────────────────────────────────

console.log("\n❗ Error Handling");

assert(srcContent.includes("isError: true"), "Returns isError on failures");
assert(srcContent.includes(".catch("), "Has top-level error catch");

// ─── CWD Environment Variable ───────────────────────────────────────────────

console.log("\n🌍 Environment Variable Support");

assert(srcContent.includes("process.env.cwd") || srcContent.includes("process.env.CWD"), "Reads cwd env var");
assert(srcContent.includes("setProjectCwd"), "Uses setProjectCwd for env var");

// ─── Summary ─────────────────────────────────────────────────────────────────

console.log(`\n${"─".repeat(40)}`);
console.log(`✅ Passed: ${passed}  ❌ Failed: ${failed}`);
if (failed > 0) process.exit(1);
