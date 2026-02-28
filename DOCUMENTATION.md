## Configuration

### Project Auto-Detection

The server automatically uses the current working directory as the AdonisJS
project root. Before running any Ace command, it verifies an `ace` file exists;
if not, it returns an error prompting you to call `set_project_cwd` with the
correct path.

**When you might need to specify `cwd`:**

- If the MCP client starts the server from a directory other than your project
  (e.g. your home folder).
- If you work with multiple AdonisJS projects and want to switch between them.

You can set `cwd` via the `env` block in your config, or call `set_project_cwd`
at runtime.

### Claude Desktop

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

### VS Code

Create `.vscode/mcp.json` in your project root:

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

### OpenAI Codex CLI

Add to `~/.codex/config.toml` (global) or `.codex/config.toml` (project-level):

```toml
[mcp_servers.adonisjs]
command = "npx"
args = ["-y", "@mkrlbs/mcp-adonisjs"]
```

### Other MCP Clients (Gemini CLI, GitHub Copilot CLI, etc.)

Add an `adonisjs` server with:

- `command`: `npx`
- `args`: `-y`, `@mkrlbs/mcp-adonisjs`

If the client does not start in your project directory, either set `cwd` /
`env.cwd` in the config or call `set_project_cwd` after connecting.
