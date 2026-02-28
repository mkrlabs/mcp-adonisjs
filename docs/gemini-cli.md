# Gemini CLI

## Option 1 — CLI Command

```bash
gemini mcp add adonisjs npx -y @mkrlbs/mcp-adonisjs
```

## Option 2 — Edit settings.json

Add to `~/.gemini/settings.json` (global) or `.gemini/settings.json` (project):

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

- `/mcp` — In interactive mode
- `gemini mcp list` — From the command line

## Specifying a Project Directory

Add `cwd` to start the server in a specific directory:

```json
{
    "mcpServers": {
        "adonisjs": {
            "command": "npx",
            "args": ["-y", "@mkrlbs/mcp-adonisjs"],
            "cwd": "/path/to/my-adonis-project"
        }
    }
}
```

## Manage Servers

```bash
gemini mcp list              # List all servers
gemini mcp remove adonisjs   # Remove server
gemini mcp enable adonisjs   # Enable server
gemini mcp disable adonisjs  # Disable server
```

---

[← Back to overview](README.md)
