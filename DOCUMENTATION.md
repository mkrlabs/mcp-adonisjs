## Configuration

### Claude Desktop

Add to your `claude_desktop_config.json`:

```json
{
    "servers": {
        "adonisjs": {
            "command": "npx",
            "args": ["-y", "@mkrlbs/mcp-adonisjs"]
        }
    }
}
```

### VS Code

1. Create a `.vscode/mcp.json` file in your project root.
2. Add the configuration below:

```json
{
    "servers": {
        "adonisjs": {
            "command": "npx",
            "args": ["-y", "@mkrlbs/mcp-adonisjs"]
        }
    }
}
```

**Local Development:**

If you are developing this package and want to test it locally within your VS
Code workspace:

```json
{
    "servers": {
        "adonisjs-local": {
            "command": "node",
            "args": ["${workspaceFolder}/build/index.js"],
            "env": {
                "cwd": "${workspaceFolder}"
            }
        }
    }
}
```

### Google Antigravity

Add the configuration below:

```json
{
    "mcpServers": {
        "adonisjs": {
            "command": "npx",
            "args": [
                "-y",
                "@mkrlbs/mcp-adonisjs"
            ]
        }
    }
}
```

### OpenAI Codex CLI

Add to your `~/.codex/config.toml` (global) or `.codex/config.toml`
(project-level):

```toml
[mcp_servers.adonisjs]
command = "npx"
args = ["-y", "@mkrlbs/mcp-adonisjs"]
```
