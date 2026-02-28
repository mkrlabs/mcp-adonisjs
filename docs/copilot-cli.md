# GitHub Copilot CLI

## Option 1 — Interactive Command

1. In interactive mode, enter `/mcp add`
2. Server Name: `adonisjs`
3. Server Type: select **STDIO** (or Local)
4. Command: `npx -y @mkrlbs/mcp-adonisjs`
5. Press `Ctrl+S` to save

## Option 2 — Edit Config File

Add to `~/.copilot/mcp-config.json`:

```json
{
    "mcpServers": {
        "adonisjs": {
            "type": "local",
            "command": "npx",
            "args": ["-y", "@mkrlbs/mcp-adonisjs"],
            "tools": ["*"]
        }
    }
}
```

## Verify Installation

- `/mcp show` — List all configured servers
- `/mcp show adonisjs` — Show details for this server

## Manage Servers

- `/mcp enable adonisjs` — Enable the server
- `/mcp disable adonisjs` — Disable the server
- `/mcp delete adonisjs` — Remove the server

---

[← Back to overview](README.md)
