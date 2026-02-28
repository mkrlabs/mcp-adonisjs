#!/usr/bin/env node

/**
 * Tests for src/services/docs.ts
 *
 * Tests: DOCS_REGISTRY completeness, topic uniqueness, category coverage,
 *        exported functions, and topic naming convention
 */

import { readFileSync } from "fs";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const srcContent = readFileSync(join(__dirname, "../src/services/docs.ts"), "utf-8");

let passed = 0;
let failed = 0;

function assert(condition, label) {
  if (condition) { console.log(`  ✅ ${label}`); passed++; }
  else { console.log(`  ❌ ${label}`); failed++; }
}

console.log("📚 Documentation Module Tests\n");

// ─── Registry Completeness ───────────────────────────────────────────────────

console.log("📋 Registry Completeness");

// Extract all entry() calls from source
const entries = [...srcContent.matchAll(/entry\("([^"]+)",\s*"([^"]+)"\)/g)];
const totalEntries = entries.length;

console.log(`  Found ${totalEntries} documentation entries`);
assert(totalEntries >= 98, `Has at least 98 entries (found ${totalEntries})`);

// ─── Topic Uniqueness ────────────────────────────────────────────────────────

console.log("\n🔑 Topic Uniqueness");

const topics = entries.map(([, , path]) => path.split("/").pop());
const uniqueTopics = new Set(topics);

// Some topics like "introduction", "overview", "authorization" appear in multiple categories
// The entry function uses path.split("/").pop() so we need to check for actual duplicates
// within the same category
const categoryTopicPairs = entries.map(([, cat, path]) => `${cat}:${path.split("/").pop()}`);
const uniquePairs = new Set(categoryTopicPairs);

assert(uniquePairs.size === entries.length, `All category:topic pairs are unique (${uniquePairs.size}/${entries.length})`);

// ─── Category Coverage ───────────────────────────────────────────────────────

console.log("\n📂 Category Coverage");

const expectedCategories = [
  "start",
  "basics",
  "frontend",
  "database",
  "auth",
  "security",
  "concepts",
  "digging-deeper",
  "ace",
  "testing",
  "tutorial-hypermedia",
  "tutorial-react",
  "reference",
  "resources",
];

const foundCategories = [...new Set(entries.map(([, cat]) => cat))];

for (const cat of expectedCategories) {
  assert(foundCategories.includes(cat), `Category "${cat}" has entries`);
}

assert(srcContent.includes("DOC_CATEGORIES"), "DOC_CATEGORIES constant is defined");

for (const cat of expectedCategories) {
  assert(srcContent.includes(`"${cat}"`), `"${cat}" is in DOC_CATEGORIES`);
}

// ─── Exported Functions ──────────────────────────────────────────────────────

console.log("\n🔍 Exported Functions");

assert(/export function getDocEntry/.test(srcContent), "getDocEntry is exported");
assert(/export function listDocTopics/.test(srcContent), "listDocTopics is exported");
assert(/export async function fetchDoc/.test(srcContent), "fetchDoc is exported (async)");
assert(/export const DOCS_REGISTRY/.test(srcContent), "DOCS_REGISTRY is exported");
assert(/export const DOC_CATEGORIES/.test(srcContent), "DOC_CATEGORIES is exported");

// ─── URL Format ──────────────────────────────────────────────────────────────

console.log("\n🔗 URL Format");

const urls = [...srcContent.matchAll(/url:\s*`([^`]+)`/g)].map(([, url]) => url);
// The template literal uses ${BASE}/ so we check the path suffix
for (const [, , path] of entries) {
  assert(!path.endsWith(".md"), `Path "${path}" does not include .md (added by template)`);
  assert(!path.startsWith("/"), `Path "${path}" does not start with /`);
}

// ─── Summary ─────────────────────────────────────────────────────────────────

console.log(`\n${"─".repeat(40)}`);
console.log(`✅ Passed: ${passed}  ❌ Failed: ${failed}`);
if (failed > 0) process.exit(1);
