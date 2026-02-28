# @mkrlbs/mcp-adonisjs

A [Model Context Protocol (MCP)](https://modelcontextprotocol.io) server that
exposes AdonisJS Ace commands as tools for AI assistants.

## Purpose

This package lets LLMs (Claude, Codex, Antigravity, etc.) scaffold, migrate,
seed, inspect AdonisJS projects, and access the official AdonisJS v7
documentation — with built-in security (blacklist, shell injection protection,
timeout).

## Architecture

```
src/
├── index.ts                  # Entry point — MCP server setup, stdio transport
├── services/
│   ├── security.ts           # Blacklist, shell injection pattern, argument validation
│   ├── ace.ts                # Project CWD management, Ace command execution
│   ├── file_generator.ts     # File creation utilities (for non-Ace scaffolding)
│   └── docs.ts               # AdonisJS v7 docs registry (98 pages, 14 categories)
└── tools/
    ├── schemas.ts            # Zod schemas for tool argument validation
    ├── definitions.ts        # TOOLS array exposed to LLMs via ListTools
    └── handlers.ts           # handleToolCall() — dispatches tool calls to logic
```

## Key Conventions

- **Tool names** use `snake_case` (e.g., `make_controller`, `migration_run`)
- **Ace command mapping**: `make_*` → `node ace make:*`, `migration_*` →
  `node ace migration:*`
- **`make_repository`** is the only tool that generates files directly (no Ace
  command exists for it)
- **`run_ace_command`** is the catch-all for commands without a dedicated tool
- **`set_project_cwd`** must be called first if the server doesn't know where
  the AdonisJS project is
- **`check_docs`** / **`list_docs`** fetch AdonisJS v7 documentation as markdown
  (98 pages across 14 categories)

## Project Auto-Detection

The server uses `process.cwd()` as the default project root. Before any Ace
command runs, it checks for an `ace` file. If not found, an error is returned
prompting the user (or LLM) to call `set_project_cwd`.

Clients can also set the `cwd` environment variable in their MCP config to
override the working directory at startup.

## MCP Client Configuration

Minimal config for any MCP client:

```json
{
  "mcpServers": {
    "adonisjs": {
      "command": "npx",
      "args": ["-y", "@mkrlbs/mcp-adonisjs"]
    }
  }
}
```

See [docs/](docs/README.md) for client-specific examples (Claude Desktop, Claude
Code, VS Code, Antigravity, Codex, Gemini CLI, etc.).

## Testing

```bash
npm test          # Runs all tests via node --test tests/*.test.js
npm run build     # Compiles TypeScript to build/
```

Tests are static analysis + runtime tests that validate security rules, tool
definitions, handler coverage, and file generation utilities.

## Publishing

Triggered by a GitHub Release → `.github/workflows/deploy.yml` →
`npm publish --access public`.
