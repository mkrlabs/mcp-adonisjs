/**
 * AdonisJS v7 documentation registry and fetcher
 *
 * Provides a categorised map of all official docs pages.
 * Each URL returns markdown when the `.md` suffix is appended.
 */

// ─── Types ───────────────────────────────────────────────────────────────────

export interface DocEntry {
    topic: string;
    category: string;
    url: string;
}

// ─── Registry ────────────────────────────────────────────────────────────────

const BASE = "https://docs.adonisjs.com";

function entry(category: string, path: string): DocEntry {
    const topic = path.split("/").pop()!;
    return { topic, category, url: `${BASE}/${path}.md` };
}

export const DOCS_REGISTRY: DocEntry[] = [
    // ── Start ────────────────────────────────────────────────────────────────
    entry("start", "introduction"),
    entry("start", "stacks-and-starter-kits"),
    entry("start", "installation"),
    entry("start", "folder-structure"),
    entry("start", "dev-environment"),
    entry("start", "configuration"),
    entry("start", "deployment"),
    entry("start", "faqs"),

    // ── Basics ───────────────────────────────────────────────────────────────
    entry("basics", "guides/basics/routing"),
    entry("basics", "guides/basics/controllers"),
    entry("basics", "guides/basics/http-context"),
    entry("basics", "guides/basics/middleware"),
    entry("basics", "guides/basics/request"),
    entry("basics", "guides/basics/response"),
    entry("basics", "guides/basics/body-parser"),
    entry("basics", "guides/basics/validation"),
    entry("basics", "guides/basics/file-uploads"),
    entry("basics", "guides/basics/session"),
    entry("basics", "guides/basics/url-builder"),
    entry("basics", "guides/basics/exception-handling"),
    entry("basics", "guides/basics/debugging"),
    entry("basics", "guides/basics/static-file-server"),

    // ── Frontend ─────────────────────────────────────────────────────────────
    entry("frontend", "guides/frontend/edgejs"),
    entry("frontend", "guides/frontend/inertia"),
    entry("frontend", "guides/frontend/transformers"),
    entry("frontend", "guides/frontend/api-client"),
    entry("frontend", "guides/frontend/tanstack-query"),
    entry("frontend", "guides/frontend/vite"),

    // ── Database ─────────────────────────────────────────────────────────────
    entry("database", "guides/database/lucid"),
    entry("database", "guides/database/redis"),

    // ── Auth ─────────────────────────────────────────────────────────────────
    entry("auth", "guides/auth/introduction"),
    entry("auth", "guides/auth/verifying-user-credentials"),
    entry("auth", "guides/auth/session-guard"),
    entry("auth", "guides/auth/access-tokens-guard"),
    entry("auth", "guides/auth/basic-auth-guard"),
    entry("auth", "guides/auth/custom-auth-guard"),
    entry("auth", "guides/auth/social-authentication"),
    entry("auth", "guides/auth/authorization"),

    // ── Security ─────────────────────────────────────────────────────────────
    entry("security", "guides/security/hashing"),
    entry("security", "guides/security/encryption"),
    entry("security", "guides/security/cors"),
    entry("security", "guides/security/securing-ssr-applications"),
    entry("security", "guides/security/rate-limiting"),

    // ── Concepts ─────────────────────────────────────────────────────────────
    entry("concepts", "guides/concepts/application-lifecycle"),
    entry("concepts", "guides/concepts/dependency-injection"),
    entry("concepts", "guides/concepts/service-providers"),
    entry("concepts", "guides/concepts/container-services"),
    entry("concepts", "guides/concepts/barrel-files"),
    entry("concepts", "guides/concepts/assembler-hooks"),
    entry("concepts", "guides/concepts/scaffolding"),
    entry("concepts", "guides/concepts/extending-adonisjs"),

    // ── Digging Deeper ───────────────────────────────────────────────────────
    entry("digging-deeper", "guides/digging-deeper/drive"),
    entry("digging-deeper", "guides/digging-deeper/emitter"),
    entry("digging-deeper", "guides/digging-deeper/health-checks"),
    entry("digging-deeper", "guides/digging-deeper/i18n"),
    entry("digging-deeper", "guides/digging-deeper/locks"),
    entry("digging-deeper", "guides/digging-deeper/logger"),
    entry("digging-deeper", "guides/digging-deeper/mail"),
    entry("digging-deeper", "guides/digging-deeper/opentelemetry"),

    // ── Ace CLI ──────────────────────────────────────────────────────────────
    entry("ace", "guides/ace/introduction"),
    entry("ace", "guides/ace/creating-commands"),
    entry("ace", "guides/ace/arguments"),
    entry("ace", "guides/ace/flags"),
    entry("ace", "guides/ace/prompts"),
    entry("ace", "guides/ace/terminal-ui"),
    entry("ace", "guides/ace/repl"),

    // ── Testing ──────────────────────────────────────────────────────────────
    entry("testing", "guides/testing/introduction"),
    entry("testing", "guides/testing/api-tests"),
    entry("testing", "guides/testing/browser-tests"),
    entry("testing", "guides/testing/console-tests"),
    entry("testing", "guides/testing/resetting-state-between-tests"),
    entry("testing", "guides/testing/test-doubles"),

    // ── Tutorial: Hypermedia ─────────────────────────────────────────────────
    entry("tutorial-hypermedia", "tutorial/hypermedia/overview"),
    entry("tutorial-hypermedia", "tutorial/hypermedia/cli-and-repl"),
    entry("tutorial-hypermedia", "tutorial/hypermedia/database-and-models"),
    entry("tutorial-hypermedia", "tutorial/hypermedia/routes-controller-views"),
    entry("tutorial-hypermedia", "tutorial/hypermedia/forms-and-validation"),
    entry("tutorial-hypermedia", "tutorial/hypermedia/styling-and-cleanup"),
    entry("tutorial-hypermedia", "tutorial/hypermedia/authorization"),

    // ── Tutorial: React ──────────────────────────────────────────────────────
    entry("tutorial-react", "tutorial/react/overview"),
    entry("tutorial-react", "tutorial/react/cli-and-repl"),
    entry("tutorial-react", "tutorial/react/database-and-models"),
    entry("tutorial-react", "tutorial/react/routes-controller-views"),
    entry("tutorial-react", "tutorial/react/forms-and-validation"),
    entry("tutorial-react", "tutorial/react/styling-and-cleanup"),
    entry("tutorial-react", "tutorial/react/authorization"),

    // ── Reference ────────────────────────────────────────────────────────────
    entry("reference", "reference/application"),
    entry("reference", "reference/adonisrc-rcfile"),
    entry("reference", "reference/commands"),
    entry("reference", "reference/edge"),
    entry("reference", "reference/events"),
    entry("reference", "reference/exceptions"),
    entry("reference", "reference/helpers"),
    entry("reference", "reference/types-helpers"),

    // ── Resources ────────────────────────────────────────────────────────────
    entry("resources", "contributing"),
    entry("resources", "releases"),
    entry("resources", "governance"),
    entry("resources", "v6-to-v7"),
];

// ─── Categories ──────────────────────────────────────────────────────────────

export const DOC_CATEGORIES = [
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
] as const;

export type DocCategory = typeof DOC_CATEGORIES[number];

// ─── Lookup Functions ────────────────────────────────────────────────────────

export function getDocEntry(topic: string): DocEntry {
    const found = DOCS_REGISTRY.find((d) => d.topic === topic);
    if (!found) {
        const available = DOCS_REGISTRY.map((d) => d.topic).join(", ");
        throw new Error(
            `Unknown documentation topic "${topic}". Available topics: ${available}`
        );
    }
    return found;
}

export function listDocTopics(category?: string): DocEntry[] {
    if (!category) return DOCS_REGISTRY;
    return DOCS_REGISTRY.filter((d) => d.category === category);
}

export async function fetchDoc(topic: string): Promise<string> {
    const entry = getDocEntry(topic);
    const response = await fetch(entry.url);
    if (!response.ok) {
        throw new Error(
            `Failed to fetch documentation for "${topic}" (HTTP ${response.status}): ${entry.url}`
        );
    }
    return response.text();
}
