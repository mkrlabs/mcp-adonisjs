#!/usr/bin/env node

/**
 * Fetches AdonisJS v7 documentation pages and outputs the markdown content to stdout.
 *
 * Usage:
 *   node scripts/fetch-docs.js routing              # Fetch a single topic
 *   node scripts/fetch-docs.js routing lucid         # Fetch multiple topics
 *   node scripts/fetch-docs.js --category auth       # Fetch all pages in a category
 *   node scripts/fetch-docs.js --list                # List all available topics
 */

const BASE = "https://docs.adonisjs.com";

const DOCS = [
  { topic: "introduction", category: "start", path: "introduction" },
  { topic: "stacks-and-starter-kits", category: "start", path: "stacks-and-starter-kits" },
  { topic: "installation", category: "start", path: "installation" },
  { topic: "folder-structure", category: "start", path: "folder-structure" },
  { topic: "dev-environment", category: "start", path: "dev-environment" },
  { topic: "configuration", category: "start", path: "configuration" },
  { topic: "deployment", category: "start", path: "deployment" },
  { topic: "faqs", category: "start", path: "faqs" },
  { topic: "routing", category: "basics", path: "guides/basics/routing" },
  { topic: "controllers", category: "basics", path: "guides/basics/controllers" },
  { topic: "http-context", category: "basics", path: "guides/basics/http-context" },
  { topic: "middleware", category: "basics", path: "guides/basics/middleware" },
  { topic: "request", category: "basics", path: "guides/basics/request" },
  { topic: "response", category: "basics", path: "guides/basics/response" },
  { topic: "body-parser", category: "basics", path: "guides/basics/body-parser" },
  { topic: "validation", category: "basics", path: "guides/basics/validation" },
  { topic: "file-uploads", category: "basics", path: "guides/basics/file-uploads" },
  { topic: "session", category: "basics", path: "guides/basics/session" },
  { topic: "url-builder", category: "basics", path: "guides/basics/url-builder" },
  { topic: "exception-handling", category: "basics", path: "guides/basics/exception-handling" },
  { topic: "debugging", category: "basics", path: "guides/basics/debugging" },
  { topic: "static-file-server", category: "basics", path: "guides/basics/static-file-server" },
  { topic: "edgejs", category: "frontend", path: "guides/frontend/edgejs" },
  { topic: "inertia", category: "frontend", path: "guides/frontend/inertia" },
  { topic: "transformers", category: "frontend", path: "guides/frontend/transformers" },
  { topic: "api-client", category: "frontend", path: "guides/frontend/api-client" },
  { topic: "tanstack-query", category: "frontend", path: "guides/frontend/tanstack-query" },
  { topic: "vite", category: "frontend", path: "guides/frontend/vite" },
  { topic: "lucid", category: "database", path: "guides/database/lucid" },
  { topic: "redis", category: "database", path: "guides/database/redis" },
  { topic: "auth-introduction", category: "auth", path: "guides/auth/introduction" },
  { topic: "verifying-user-credentials", category: "auth", path: "guides/auth/verifying-user-credentials" },
  { topic: "session-guard", category: "auth", path: "guides/auth/session-guard" },
  { topic: "access-tokens-guard", category: "auth", path: "guides/auth/access-tokens-guard" },
  { topic: "basic-auth-guard", category: "auth", path: "guides/auth/basic-auth-guard" },
  { topic: "custom-auth-guard", category: "auth", path: "guides/auth/custom-auth-guard" },
  { topic: "social-authentication", category: "auth", path: "guides/auth/social-authentication" },
  { topic: "authorization", category: "auth", path: "guides/auth/authorization" },
  { topic: "hashing", category: "security", path: "guides/security/hashing" },
  { topic: "encryption", category: "security", path: "guides/security/encryption" },
  { topic: "cors", category: "security", path: "guides/security/cors" },
  { topic: "securing-ssr-applications", category: "security", path: "guides/security/securing-ssr-applications" },
  { topic: "rate-limiting", category: "security", path: "guides/security/rate-limiting" },
  { topic: "application-lifecycle", category: "concepts", path: "guides/concepts/application-lifecycle" },
  { topic: "dependency-injection", category: "concepts", path: "guides/concepts/dependency-injection" },
  { topic: "service-providers", category: "concepts", path: "guides/concepts/service-providers" },
  { topic: "container-services", category: "concepts", path: "guides/concepts/container-services" },
  { topic: "barrel-files", category: "concepts", path: "guides/concepts/barrel-files" },
  { topic: "assembler-hooks", category: "concepts", path: "guides/concepts/assembler-hooks" },
  { topic: "scaffolding", category: "concepts", path: "guides/concepts/scaffolding" },
  { topic: "extending-adonisjs", category: "concepts", path: "guides/concepts/extending-adonisjs" },
  { topic: "drive", category: "digging-deeper", path: "guides/digging-deeper/drive" },
  { topic: "emitter", category: "digging-deeper", path: "guides/digging-deeper/emitter" },
  { topic: "health-checks", category: "digging-deeper", path: "guides/digging-deeper/health-checks" },
  { topic: "i18n", category: "digging-deeper", path: "guides/digging-deeper/i18n" },
  { topic: "locks", category: "digging-deeper", path: "guides/digging-deeper/locks" },
  { topic: "logger", category: "digging-deeper", path: "guides/digging-deeper/logger" },
  { topic: "mail", category: "digging-deeper", path: "guides/digging-deeper/mail" },
  { topic: "opentelemetry", category: "digging-deeper", path: "guides/digging-deeper/opentelemetry" },
  { topic: "ace-introduction", category: "ace", path: "guides/ace/introduction" },
  { topic: "creating-commands", category: "ace", path: "guides/ace/creating-commands" },
  { topic: "arguments", category: "ace", path: "guides/ace/arguments" },
  { topic: "flags", category: "ace", path: "guides/ace/flags" },
  { topic: "prompts", category: "ace", path: "guides/ace/prompts" },
  { topic: "terminal-ui", category: "ace", path: "guides/ace/terminal-ui" },
  { topic: "repl", category: "ace", path: "guides/ace/repl" },
  { topic: "testing-introduction", category: "testing", path: "guides/testing/introduction" },
  { topic: "api-tests", category: "testing", path: "guides/testing/api-tests" },
  { topic: "browser-tests", category: "testing", path: "guides/testing/browser-tests" },
  { topic: "console-tests", category: "testing", path: "guides/testing/console-tests" },
  { topic: "resetting-state-between-tests", category: "testing", path: "guides/testing/resetting-state-between-tests" },
  { topic: "test-doubles", category: "testing", path: "guides/testing/test-doubles" },
  { topic: "hypermedia-overview", category: "tutorial-hypermedia", path: "tutorial/hypermedia/overview" },
  { topic: "hypermedia-cli-and-repl", category: "tutorial-hypermedia", path: "tutorial/hypermedia/cli-and-repl" },
  { topic: "hypermedia-database-and-models", category: "tutorial-hypermedia", path: "tutorial/hypermedia/database-and-models" },
  { topic: "hypermedia-routes-controller-views", category: "tutorial-hypermedia", path: "tutorial/hypermedia/routes-controller-views" },
  { topic: "hypermedia-forms-and-validation", category: "tutorial-hypermedia", path: "tutorial/hypermedia/forms-and-validation" },
  { topic: "hypermedia-styling-and-cleanup", category: "tutorial-hypermedia", path: "tutorial/hypermedia/styling-and-cleanup" },
  { topic: "hypermedia-authorization", category: "tutorial-hypermedia", path: "tutorial/hypermedia/authorization" },
  { topic: "react-overview", category: "tutorial-react", path: "tutorial/react/overview" },
  { topic: "react-cli-and-repl", category: "tutorial-react", path: "tutorial/react/cli-and-repl" },
  { topic: "react-database-and-models", category: "tutorial-react", path: "tutorial/react/database-and-models" },
  { topic: "react-routes-controller-views", category: "tutorial-react", path: "tutorial/react/routes-controller-views" },
  { topic: "react-forms-and-validation", category: "tutorial-react", path: "tutorial/react/forms-and-validation" },
  { topic: "react-styling-and-cleanup", category: "tutorial-react", path: "tutorial/react/styling-and-cleanup" },
  { topic: "react-authorization", category: "tutorial-react", path: "tutorial/react/authorization" },
  { topic: "ref-application", category: "reference", path: "reference/application" },
  { topic: "ref-adonisrc-rcfile", category: "reference", path: "reference/adonisrc-rcfile" },
  { topic: "ref-commands", category: "reference", path: "reference/commands" },
  { topic: "ref-edge", category: "reference", path: "reference/edge" },
  { topic: "ref-events", category: "reference", path: "reference/events" },
  { topic: "ref-exceptions", category: "reference", path: "reference/exceptions" },
  { topic: "ref-helpers", category: "reference", path: "reference/helpers" },
  { topic: "ref-types-helpers", category: "reference", path: "reference/types-helpers" },
  { topic: "contributing", category: "resources", path: "contributing" },
  { topic: "releases", category: "resources", path: "releases" },
  { topic: "governance", category: "resources", path: "governance" },
  { topic: "v6-to-v7", category: "resources", path: "v6-to-v7" },
];

// ─── CLI ─────────────────────────────────────────────────────────────────────

const args = process.argv.slice(2);

if (args.includes("--list")) {
  const categories = [...new Set(DOCS.map((d) => d.category))];
  for (const cat of categories) {
    console.log(`\n📂 ${cat}`);
    DOCS.filter((d) => d.category === cat).forEach((d) => console.log(`   ${d.topic}`));
  }
  console.log(`\n📊 Total: ${DOCS.length} pages`);
  process.exit(0);
}

let targets = [];

const catIdx = args.indexOf("--category");
if (catIdx !== -1 && args[catIdx + 1]) {
  const cat = args[catIdx + 1];
  targets = DOCS.filter((d) => d.category === cat);
  if (targets.length === 0) {
    console.error(`❌ Unknown category: "${cat}"`);
    console.error(`Available: ${[...new Set(DOCS.map((d) => d.category))].join(", ")}`);
    process.exit(1);
  }
} else if (args.length > 0) {
  targets = DOCS.filter((d) => args.includes(d.topic));
  if (targets.length === 0) {
    console.error(`❌ No matching topics: ${args.join(", ")}`);
    console.error(`Use --list to see available topics.`);
    process.exit(1);
  }
} else {
  console.error("Usage:");
  console.error("  node fetch-docs.js <topic> [topic2...]   Fetch specific topics");
  console.error("  node fetch-docs.js --category <name>     Fetch all in a category");
  console.error("  node fetch-docs.js --list                List available topics");
  process.exit(1);
}

// ─── Fetch & Output ──────────────────────────────────────────────────────────

for (const doc of targets) {
  const url = `${BASE}/${doc.path}.md`;

  try {
    const res = await fetch(url);
    if (!res.ok) {
      console.error(`❌ ${doc.topic} — HTTP ${res.status}`);
      continue;
    }
    const content = await res.text();

    if (targets.length > 1) {
      console.log(`\n${"═".repeat(80)}`);
      console.log(`📄 ${doc.topic} (${doc.category})`);
      console.log(`${"═".repeat(80)}\n`);
    }

    console.log(content);
  } catch (err) {
    console.error(`❌ ${doc.topic} — ${err.message}`);
  }
}
