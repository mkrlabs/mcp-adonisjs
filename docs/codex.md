# OpenAI Codex

## Option 1 — CLI Command (Simplest)

```bash
codex mcp add adonisjs -- npx -y @mkrlbs/mcp-adonisjs
```

## Option 2 — Edit config.toml

Add to `~/.codex/config.toml` (global) or `.codex/config.toml` (project-level,
trusted projects only):

```toml
[mcp_servers.adonisjs]
command = "npx"
args = ["-y", "@mkrlbs/mcp-adonisjs"]
```

## Verify Installation

Use `/mcp` in the Codex TUI to verify the server is active.

## Specifying a Project Directory

Add `cwd` to start the server in a specific directory:

```toml
[mcp_servers.adonisjs]
command = "npx"
args = ["-y", "@mkrlbs/mcp-adonisjs"]
cwd = "/path/to/my-adonis-project"
```

---

[← Back to overview](README.md)
