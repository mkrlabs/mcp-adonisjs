# OpenCode

Add to your `opencode.json` (project root or `~/.config/opencode/config.json`):

```json
{
    "$schema": "https://opencode.ai/config.json",
    "mcp": {
        "adonisjs": {
            "type": "local",
            "command": ["npx", "-y", "@mkrlbs/mcp-adonisjs"]
        }
    }
}
```

## Verify Installation

```bash
opencode mcp list
```

## Specifying a Project Directory

Add `environment` with the `cwd` variable:

```json
{
    "$schema": "https://opencode.ai/config.json",
    "mcp": {
        "adonisjs": {
            "type": "local",
            "command": ["npx", "-y", "@mkrlbs/mcp-adonisjs"],
            "environment": {
                "cwd": "/path/to/my-adonis-project"
            }
        }
    }
}
```

---

[← Back to overview](README.md)
