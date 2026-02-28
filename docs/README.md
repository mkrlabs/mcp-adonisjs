# Installation Guide

This MCP server can be installed in any MCP-compatible client. Choose your
client below for specific instructions.

## Project Auto-Detection

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

## Client-Specific Instructions

| Client                               | Config Format | CLI Support |
| :----------------------------------- | :------------ | :---------- |
| [Claude Desktop](claude-desktop.md)  | JSON          | —           |
| [Claude Code](claude-code.md)        | JSON          | ✓           |
| [VS Code](vscode.md)                 | JSON          | ✓           |
| [Google Antigravity](antigravity.md) | JSON          | —           |
| [OpenAI Codex](codex.md)             | TOML          | ✓           |
| [GitHub Copilot CLI](copilot-cli.md) | JSON          | ✓           |
| [OpenCode](opencode.md)              | JSON          | ✓           |
| [Gemini CLI](gemini-cli.md)          | JSON          | ✓           |
| [Other Clients](other-clients.md)    | varies        | —           |

## Quick Reference

All clients use the same core configuration:

- **Command**: `npx`
- **Args**: `-y`, `@mkrlbs/mcp-adonisjs`
- **Transport**: stdio

The exact syntax varies by client — see the individual guides above.
