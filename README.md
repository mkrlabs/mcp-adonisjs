# AdonisJS MCP Server

[![Documentation](https://img.shields.io/badge/Read-Documentation-blue?style=for-the-badge&logo=markdown)](DOCUMENTATION.md)

A secure [Model Context Protocol (MCP)](https://modelcontextprotocol.io) server
for executing AdonisJS Ace commands. This server allows AI assistants to
interact with AdonisJS projects through a controlled, secure interface.

## Features

- 🔒 **Secure by default**: Blacklists dangerous commands and prevents shell
  injection
- 🛠️ **25 dedicated tools**: Pre-configured tools for all common AdonisJS
  operations
- 📚 **Built-in docs access**: Fetch AdonisJS v7 documentation directly as
  markdown
- ⏱️ **Timeout protection**: 30s timeout prevents infinite hangs on interactive
  prompts
- ✅ **Validation**: Strict argument validation using Zod schemas
- 📦 **TypeScript**: Fully typed with TypeScript for better DX

## Quick Start

This is an MCP server - it runs as an external process launched by your AI
client. Configure it in your MCP client settings:

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

See the [documentation](DOCUMENTATION.md) for client-specific instructions (VS
Code, Claude Desktop, Antigravity, Codex CLI, etc.).

## Available Tools

### Scaffolding

| Tool              | Command                    | Extra args                        |
| :---------------- | :------------------------- | :-------------------------------- |
| `make_controller` | `node ace make:controller` | `resource` (boolean)              |
| `make_service`    | `node ace make:service`    | —                                 |
| `make_migration`  | `node ace make:migration`  | `withModel` (boolean, `-m` flag)  |
| `make_model`      | `node ace make:model`      | —                                 |
| `make_validator`  | `node ace make:validator`  | —                                 |
| `make_seeder`     | `node ace make:seeder`     | —                                 |
| `make_exception`  | `node ace make:exception`  | —                                 |
| `make_middleware` | `node ace make:middleware` | —                                 |
| `make_test`       | `node ace make:test`       | `suite` (unit/functional/browser) |
| `make_factory`    | `node ace make:factory`    | —                                 |
| `make_policy`     | `node ace make:policy`     | —                                 |
| `make_event`      | `node ace make:event`      | —                                 |
| `make_listener`   | `node ace make:listener`   | —                                 |
| `make_mailer`     | `node ace make:mailer`     | —                                 |
| `make_command`    | `node ace make:command`    | —                                 |
| `make_repository` | _(file generation)_        | —                                 |

### Database & Routing

| Tool                 | Command                       | Extra args        |
| :------------------- | :---------------------------- | :---------------- |
| `migration_run`      | `node ace migration:run`      | `force` (boolean) |
| `migration_rollback` | `node ace migration:rollback` | `batch` (number)  |
| `migration_status`   | `node ace migration:status`   | —                 |
| `db_seed`            | `node ace db:seed`            | `files` (string)  |
| `list_routes`        | `node ace list:routes`        | —                 |

### Documentation

| Tool         | Description                                        | Args                          |
| :----------- | :------------------------------------------------- | :---------------------------- |
| `check_docs` | Fetches AdonisJS v7 docs for a topic as markdown   | `topic` (string)              |
| `list_docs`  | Lists available doc topics, filterable by category | `category` (string, optional) |

**14 categories available:** start, basics, frontend, database, auth, security,
concepts, digging-deeper, ace, testing, tutorial-hypermedia, tutorial-react,
reference, resources.

### Utility

| Tool              | Description                                 | Args                                  |
| :---------------- | :------------------------------------------ | :------------------------------------ |
| `set_project_cwd` | Sets the working directory for Ace commands | `path` (string)                       |
| `run_ace_command` | Catch-all for any Ace command               | `command` (string), `args` (string[]) |

All scaffolding tools accept a `name` (string, required) argument.

### Examples

```json
{ "name": "UserController", "resource": true }
```

```json
{ "name": "create_projects_table", "withModel": true }
```

```json
{ "name": "users/list", "suite": "functional" }
```

```json
{ "command": "make:provider", "args": ["AppProvider"] }
```

```json
{ "topic": "routing" }
```

```json
{ "category": "auth" }
```

## Security

### Blacklisted Commands

The following commands are blacklisted for security reasons:

- `migration:fresh`

Attempting to run these commands will result in an error.

### Shell Injection Protection

All command arguments are validated to prevent shell injection attacks. The
following characters are not allowed:

- `;` (semicolon)
- `&` (ampersand)
- `|` (pipe)
- `` ` `` (backtick)
- `$` (dollar sign)
- `<>` (angle brackets)
- `\` (backslash)

### Timeout

All commands have a 30 second timeout to prevent infinite hangs on interactive
prompts.

## Development

### Building

```bash
npm run build
```

### Testing

```bash
npm run test
```

### Watch Mode

```bash
npm run watch
```

## Requirements

- Node.js 24+
- An AdonisJS project (auto-detected or set via `set_project_cwd` tool)

## License

MIT
