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

### Claude Code

**Option 1 — CLI command:**

```bash
claude mcp add --transport stdio adonisjs -- npx -y @mkrlbs/mcp-adonisjs
```

**Option 2 — Edit .mcp.json:**

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

Use `/mcp` within Claude Code to check server status and authenticate if needed.

**Scopes:**

- `--scope local` (default): Available only to you in the current project
- `--scope project`: Shared via `.mcp.json` file
- `--scope user`: Available across all your projects

### VS Code

**Option 1 — Command Palette:**

1. Open Command Palette (`Ctrl+Shift+P` / `Cmd+Shift+P`)
2. Run **MCP: Add Server**
3. Select **Command (stdio)**
4. Enter: `npx -y @mkrlbs/mcp-adonisjs`
5. Choose **Workspace** or **User profile**

**Option 2 — Edit mcp.json:**

Create `.vscode/mcp.json` in your workspace (shared with team) or run **MCP:
Open User Configuration** (available across all workspaces):

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

### OpenAI Codex

**Option 1 — CLI command (simplest):**

```bash
codex mcp add adonisjs -- npx -y @mkrlbs/mcp-adonisjs
```

**Option 2 — Edit config.toml:**

Add to `~/.codex/config.toml` (global) or `.codex/config.toml` (project-level,
trusted projects only):

```toml
[mcp_servers.adonisjs]
command = "npx"
args = ["-y", "@mkrlbs/mcp-adonisjs"]
```

To start the server in a specific directory, add `cwd`:

```toml
[mcp_servers.adonisjs]
command = "npx"
args = ["-y", "@mkrlbs/mcp-adonisjs"]
cwd = "/path/to/my-adonis-project"
```

Use `/mcp` in the Codex TUI to verify the server is active.

### GitHub Copilot CLI

**Option 1 — Interactive command:**

1. In interactive mode, enter `/mcp add`
2. Server Name: `adonisjs`
3. Server Type: select **STDIO** (or Local)
4. Command: `npx -y @mkrlbs/mcp-adonisjs`
5. Press `Ctrl+S` to save

**Option 2 — Edit config file:**

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

Use `/mcp show` to list configured servers and `/mcp show adonisjs` for details.

### OpenCode

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

Use `opencode mcp list` to verify the server is active.

### Gemini CLI

**Option 1 — CLI command:**

```bash
gemini mcp add adonisjs npx -y @mkrlbs/mcp-adonisjs
```

**Option 2 — Edit settings.json:**

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

To start the server in a specific directory, add `cwd`:

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

Use `/mcp` in interactive mode or `gemini mcp list` to check server status.

### Other MCP Clients

Add an `adonisjs` server with:

- `command`: `npx`
- `args`: `-y`, `@mkrlbs/mcp-adonisjs`

If the client does not start in your project directory, either set `cwd` /
`env.cwd` in the config or call `set_project_cwd` after connecting.
