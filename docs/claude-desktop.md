# Claude Desktop

Add to your `claude_desktop_config.json`:

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

## Config File Location

- **macOS**: `~/Library/Application Support/Claude/claude_desktop_config.json`
- **Windows**: `%APPDATA%\Claude\claude_desktop_config.json`

## Specifying a Project Directory

If Claude Desktop starts from a different directory, add `cwd` to the `env`
block:

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
