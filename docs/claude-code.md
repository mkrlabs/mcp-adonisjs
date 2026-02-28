# Claude Code

## Option 1 — CLI Command

```bash
claude mcp add --transport stdio adonisjs -- npx -y @mkrlbs/mcp-adonisjs
```

## Option 2 — Edit .mcp.json

Create `.mcp.json` in your project root (shared with team via version control):

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

## Verify Installation

Use `/mcp` within Claude Code to check server status and authenticate if needed.

## Scopes

| Scope             | Description                                      |
| :---------------- | :----------------------------------------------- |
| `--scope local`   | Available only to you in the current project     |
| `--scope project` | Shared via `.mcp.json` file (version controlled) |
| `--scope user`    | Available across all your projects               |

## Specifying a Project Directory

Add `cwd` to the `env` block if needed:

```json
{
    "mcpServers": {
        "adonisjs": {
            "command": "npx",
            "args": ["-y", "@mkrlbs/mcp-adonisjs"],
            "env": {
                "cwd": "/path/to/my-adonis-project"
            }
        }
    }
}
```

---

[← Back to overview](README.md)
