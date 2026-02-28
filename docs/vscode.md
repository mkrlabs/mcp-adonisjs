# VS Code

## Option 1 — Command Palette

1. Open Command Palette (`Ctrl+Shift+P` / `Cmd+Shift+P`)
2. Run **MCP: Add Server**
3. Select **Command (stdio)**
4. Enter: `npx -y @mkrlbs/mcp-adonisjs`
5. Choose **Workspace** or **User profile**

## Option 2 — Edit mcp.json

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

## Verify Installation

- Right-click a server in the **MCP SERVERS - INSTALLED** section
- Or run **MCP: List Servers** from the Command Palette

## Local Development

If you are developing this package and want to test it locally:

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

---

[← Back to overview](README.md)
