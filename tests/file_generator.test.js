#!/usr/bin/env node

/**
 * Tests for src/services/file_generator.ts
 *
 * Tests: toSnakeCase, createFileWithContent
 */

import { readFileSync, mkdtempSync, existsSync, rmSync } from "fs";
import { fileURLToPath } from "url";
import { dirname, join } from "path";
import { tmpdir } from "os";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Import compiled module for runtime tests
const { toSnakeCase, createFileWithContent } = await import(
  join(__dirname, "../build/services/file_generator.js")
);

let passed = 0;
let failed = 0;

function assert(condition, label) {
  if (condition) { console.log(`  ✅ ${label}`); passed++; }
  else { console.log(`  ❌ ${label}`); failed++; }
}

console.log("📂 File Generator Tests\n");

// ─── toSnakeCase ─────────────────────────────────────────────────────────────

console.log("🐍 toSnakeCase");

const snakeCases = [
  ["UserRepository", "user_repository"],
  ["User", "user"],
  ["ProjectController", "project_controller"],
  ["HTMLParser", "h_t_m_l_parser"],
  ["myService", "my_service"],
  ["A", "a"],
  ["already_snake", "already_snake"],
];

for (const [input, expected] of snakeCases) {
  const result = toSnakeCase(input);
  assert(result === expected, `"${input}" → "${result}" (expected "${expected}")`);
}

// ─── createFileWithContent ───────────────────────────────────────────────────

console.log("\n📝 createFileWithContent");

const tmpDir = mkdtempSync(join(tmpdir(), "mcp-test-"));

try {
  // Creates file with content
  const filePath = join(tmpDir, "sub", "test.ts");
  const result = createFileWithContent(filePath, "hello world");
  assert(existsSync(filePath), "File is created");
  assert(readFileSync(filePath, "utf-8") === "hello world", "File has correct content");
  assert(result === filePath, "Returns file path");

  // Creates nested directories
  const deepPath = join(tmpDir, "a", "b", "c", "deep.ts");
  createFileWithContent(deepPath, "deep content");
  assert(existsSync(deepPath), "Creates nested directories");

  // Throws on existing file
  let threw = false;
  try {
    createFileWithContent(filePath, "overwrite attempt");
  } catch (e) {
    threw = true;
    assert(e.message.includes("already exists"), "Error message mentions 'already exists'");
  }
  assert(threw, "Throws when file already exists");
} finally {
  rmSync(tmpDir, { recursive: true, force: true });
}

// ─── Summary ─────────────────────────────────────────────────────────────────

console.log(`\n${"─".repeat(40)}`);
console.log(`✅ Passed: ${passed}  ❌ Failed: ${failed}`);
if (failed > 0) process.exit(1);
