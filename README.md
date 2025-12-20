# AdonisJS MCP Server

A secure [Model Context Protocol (MCP)](https://modelcontextprotocol.io) server for executing AdonisJS Ace commands. This server allows AI assistants to interact with AdonisJS projects through a controlled, secure interface.

## Features

- 🔒 **Secure by default**: Blacklists dangerous commands and prevents shell injection
- 🛠️ **Multiple tools**: Pre-configured tools for common AdonisJS operations
- ✅ **Validation**: Strict argument validation using Zod schemas
- 📦 **TypeScript**: Fully typed with TypeScript for better DX

## Installation

```bash
npm install @mkrlbs/mcp-adonisjs
```

## Available Tools

### 1. `make_controller`

Creates an AdonisJS controller using `node ace make:controller`.

**Arguments:**
- `name` (string, required): Name of the controller to create
- `resource` (boolean, optional): Whether to create a resource controller (default: false)

**Example:**
```json
{
  "name": "UserController",
  "resource": true
}
```

### 2. `make_service`

Creates an AdonisJS service using `node ace make:service`.

**Arguments:**
- `name` (string, required): Name of the service to create

**Example:**
```json
{
  "name": "AuthService"
}
```

### 3. `run_ace_command`

Executes any AdonisJS Ace command with security checks.

**Arguments:**
- `command` (string, required): The Ace command to run (e.g., 'make:model')
- `args` (array of strings, optional): Arguments to pass to the command

**Example:**
```json
{
  "command": "make:model",
  "args": ["User", "--migration"]
}
```

## Security

### Blacklisted Commands

The following commands are blacklisted for security reasons:
- `db:wipe`
- `migration:fresh`
- `migration:refresh`
- `migration:reset`

Attempting to run these commands will result in an error.

### Shell Injection Protection

All command arguments are validated to prevent shell injection attacks. The following characters are not allowed:
- `;` (semicolon)
- `&` (ampersand)
- `|` (pipe)
- `` ` `` (backtick)
- `$` (dollar sign)
- `()` (parentheses)
- `{}` (curly braces)
- `[]` (square brackets)
- `<>` (angle brackets)
- `\` (backslash)

## Configuration

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

### Other MCP Clients

The server uses stdio transport and can be configured with any MCP-compatible client. Provide the command:

```bash
npx @mkrlbs/mcp-adonisjs
```

## Development

### Building

```bash
npm run build
```

### Watch Mode

```bash
npm run watch
```

## Requirements

- Node.js 18+
- An AdonisJS project in the current working directory

## License

MIT

