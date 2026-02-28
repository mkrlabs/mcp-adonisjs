# Google Antigravity

## Installation Steps

1. Open the MCP Store via the **"..."** dropdown at the top of the editor's
   agent panel.
2. Click **Manage MCP Servers** → **View raw config**.
3. Add the following to your `mcp_config.json`:

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

Resources and tools are available once the server starts.

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
