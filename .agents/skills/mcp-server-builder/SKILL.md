---
name: MCP Server Builder
description: Expert guide to build production-ready Model Context Protocol (MCP) servers compatible with Claude, VS Code, Antigravity, OpenCode, GitHub Copilot, Gemini, and OpenAI Codex.
---

# MCP Server Builder

Build production-ready [Model Context Protocol](https://modelcontextprotocol.io)
servers that work across **all major AI coding assistants**.

---

## 1. Project Scaffolding

### Initialize the project

```bash
mkdir my-mcp-server && cd my-mcp-server
npm init -y
npm install @modelcontextprotocol/sdk zod
npm install -D typescript @types/node
```

### `tsconfig.json`

```json
{
    "compilerOptions": {
        "target": "ES2022",
        "module": "Node16",
        "moduleResolution": "Node16",
        "outDir": "./build",
        "rootDir": "./src",
        "strict": true,
        "esModuleInterop": true,
        "skipLibCheck": true,
        "forceConsistentCasingInFileNames": true,
        "resolveJsonModule": true,
        "declaration": true,
        "declarationMap": true,
        "sourceMap": true
    },
    "include": ["src/**/*"],
    "exclude": ["node_modules", "build"]
}
```

### `package.json` — critical fields

```json
{
    "name": "@scope/mcp-my-server",
    "type": "module",
    "bin": {
        "mcp-my-server": "./build/index.js"
    },
    "files": ["build", "README.md"],
    "scripts": {
        "build": "tsc",
        "prepare": "npm run build",
        "test": "node tests/test.js"
    }
}
```

> [!CAUTION]
> **Always include `"type": "module"`** — the MCP SDK uses ESM imports. **Always
> include `"bin"`** — this is how `npx` finds the executable.

---

## 2. Architecture

Follow this modular structure. **Never** put everything in a single file.

```
src/
├── index.ts                  # Entry point — MCP server setup, stdio transport
├── services/
│   ├── security.ts           # Blacklist, shell injection, argument validation
│   └── executor.ts           # Command/API execution logic
└── tools/
    ├── schemas.ts            # Zod schemas for tool argument validation
    ├── definitions.ts        # TOOLS array exposed to LLMs via ListTools
    └── handlers.ts           # handleToolCall() — dispatches tool calls to logic
```

### Separation of concerns

| Layer                  | Responsibility                                                    |
| :--------------------- | :---------------------------------------------------------------- |
| `index.ts`             | Server instantiation, transport, startup                          |
| `tools/definitions.ts` | Tool metadata exposed to the LLM (name, description, inputSchema) |
| `tools/schemas.ts`     | Zod schemas for runtime argument validation                       |
| `tools/handlers.ts`    | Tool dispatch: maps tool name → business logic                    |
| `services/`            | Reusable business logic (execution, security, file I/O)           |

---

## 3. Entry Point (`src/index.ts`)

> [!IMPORTANT]
> **The shebang `#!/usr/bin/env node` MUST be the very first line.** Without it,
> `npx` will try to execute the file as a shell script, causing
> `import: command not found` errors. TypeScript preserves shebangs during
> compilation.

```typescript
#!/usr/bin/env node

import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
    CallToolRequestSchema,
    ListToolsRequestSchema,
} from "@modelcontextprotocol/sdk/types.js";

import { TOOLS } from "./tools/definitions.js";
import { handleToolCall } from "./tools/handlers.js";

const server = new Server(
    { name: "my-mcp-server", version: "1.0.0" },
    { capabilities: { tools: {} } },
);

// List available tools
server.setRequestHandler(ListToolsRequestSchema, async () => {
    return { tools: TOOLS };
});

// Handle tool calls
server.setRequestHandler(CallToolRequestSchema, async (request) => {
    try {
        const { name, arguments: args } = request.params;
        return handleToolCall(name, args);
    } catch (error: any) {
        return {
            content: [{ type: "text", text: `Error: ${error.message}` }],
            isError: true,
        };
    }
});

// Start
async function main() {
    const transport = new StdioServerTransport();
    await server.connect(transport);
    // Always log to stderr — stdout is reserved for MCP protocol messages
    console.error("MCP Server running on stdio");
}

main().catch((error) => {
    console.error("Fatal error:", error);
    process.exit(1);
});
```

### Key rules

- **stdout is reserved** for MCP JSON-RPC messages. All logging MUST use
  `console.error()`.
- **Wrap `CallToolRequestSchema` handler** in try/catch and return
  `{ isError: true }` on failure — never let exceptions crash the server.
- **Read version from `package.json`** instead of hardcoding:
  ```typescript
  import { createRequire } from "module";
  const require = createRequire(import.meta.url);
  const { version } = require("../package.json");
  ```

---

## 4. Tool Definitions (`tools/definitions.ts`)

Tools are functions that the LLM can invoke. Each tool needs:

| Field         | Type        | Description                                                                |
| :------------ | :---------- | :------------------------------------------------------------------------- |
| `name`        | string      | Unique identifier, **must be `snake_case`**                                |
| `description` | string      | Clear, actionable description the LLM reads to decide when to use the tool |
| `inputSchema` | JSON Schema | Describes expected arguments                                               |

### Naming conventions

- Use `snake_case`: `make_controller`, `run_query`, `list_routes`
- Group by action: `make_*`, `list_*`, `migration_*`, `db_*`
- Include a catch-all tool for flexibility: `run_command`

### Writing effective descriptions

Descriptions are **prompts for the LLM**. They determine when and how the tool
gets used.

```typescript
// ❌ Bad — vague, LLM won't know when to use it
{
    description: "Creates a migration";
}

// ✅ Good — specific, includes the command, mentions related tools
{
    description: "Creates an AdonisJS migration using 'node ace make:migration'. Use withModel to also create the model (-m flag).";
}
```

**Best practices for tool descriptions:**

1. **State what the tool does** in imperative form
2. **Mention the underlying command** or API being called
3. **Describe optional parameters** and when to use them
4. **Reference related tools** when disambiguation helps
5. **Include examples** in parameter descriptions:
   `"Name of the migration (e.g., 'create_projects_table')"`
6. **Mention restrictions** inline: `"Blacklisted: migration:fresh"`

### Helper for repetitive tools

```typescript
function simpleNameTool(
    name: string,
    description: string,
    paramDesc: string,
): ToolDef {
    return {
        name,
        description,
        inputSchema: {
            type: "object",
            properties: {
                name: { type: "string", description: paramDesc },
            },
            required: ["name"],
        },
    };
}
```

### inputSchema guidelines

- Use **JSON Schema** (not Zod) — this is what the MCP protocol sends to the
  LLM.
- Always set `type: "object"` at the root.
- Mark required parameters in `required: [...]`.
- Provide `default` values where applicable.
- Use `enum` for constrained choices:
  ```json
  { "type": "string", "enum": ["unit", "functional", "browser"] }
  ```

---

## 5. Argument Validation (`tools/schemas.ts`)

Use **Zod** for runtime validation inside handlers. Zod schemas mirror the
`inputSchema` but add type-safety.

```typescript
import { z } from "zod";

export const MyToolArgsSchema = z.object({
    name: z.string().describe("Name of the resource"),
    force: z.boolean().optional().default(false).describe("Skip confirmation"),
});
```

**Always call `.parse(args)` in the handler** — this gives clear error messages
when the LLM sends malformed input.

---

## 6. Tool Handlers (`tools/handlers.ts`)

```typescript
interface ToolResult {
    content: { type: string; text: string }[];
    isError?: boolean;
}

function success(text: string): ToolResult {
    return { content: [{ type: "text", text }] };
}

export function handleToolCall(name: string, args: unknown): ToolResult {
    switch (name) {
        case "my_tool": {
            const parsed = MyToolArgsSchema.parse(args);
            // ... business logic ...
            return success(`Done: ${result}`);
        }
        default:
            throw new Error(`Unknown tool: ${name}`);
    }
}
```

**Handler rules:**

- Use a `switch` statement — clear, auditable, no magic routing.
- Always parse arguments with Zod before using them.
- Return structured `{ content, isError }` — never throw from the handler
  itself.
- Prefix success messages with what happened:
  `"Controller created successfully:\n..."`.

---

## 7. Security

### Shell injection protection

If your MCP server executes shell commands, **always** validate arguments:

```typescript
const SHELL_INJECTION_PATTERN = /[;&|`$<>\\]/;

export function validateArguments(args: string[]): void {
    for (const arg of args) {
        if (SHELL_INJECTION_PATTERN.test(arg)) {
            throw new Error(
                `Invalid argument "${arg}": contains potentially dangerous characters`,
            );
        }
    }
}
```

### Command blacklisting

Blacklist destructive or dangerous commands:

```typescript
export const BLACKLISTED_COMMANDS = ["migration:fresh", "db:wipe"];

export function isBlacklisted(command: string): boolean {
    return BLACKLISTED_COMMANDS.includes(command);
}
```

### Execution timeout

Always set a timeout to prevent hanging on interactive prompts:

```typescript
execSync(command, {
    timeout: 30_000, // 30s max
    stdio: ["pipe", "pipe", "pipe"], // Never inherit — capture all I/O
});
```

### Security checklist

- [ ] All arguments validated against shell injection
- [ ] Dangerous commands blacklisted
- [ ] Execution timeout configured
- [ ] `stdio: ["pipe", "pipe", "pipe"]` — never inherit stdin/stdout
- [ ] No user-supplied strings interpolated into shell commands without
      validation
- [ ] Catch-all tool includes blacklist in its description

---

## 8. Testing

Create static analysis + runtime tests. Test the **compiled output** too.

### Must-test checklist

| Test                       | What it validates                                     |
| :------------------------- | :---------------------------------------------------- |
| Blacklist configuration    | Dangerous commands are blocked, safe commands allowed |
| Shell injection protection | Dangerous chars blocked, valid args allowed           |
| Security functions exist   | `validateArguments`, `isBlacklisted`, etc.            |
| Tool definitions complete  | All tools present in the TOOLS array                  |
| Handler coverage           | Every tool has a `case` in the switch                 |
| Timeout protection         | `timeout:` configured in execSync                     |
| **Shebang validation**     | `#!/usr/bin/env node` is line 1 of source AND build   |

### Shebang test example

```javascript
const SHEBANG = "#!/usr/bin/env node";

// Check source
if (srcContent.startsWith(SHEBANG)) {
    console.log("✅ Source starts with shebang");
} else {
    console.log("❌ Source is missing shebang — npx will fail!");
}

// Check compiled output
const buildContent = readFileSync("build/index.js", "utf-8");
if (buildContent.startsWith(SHEBANG)) {
    console.log("✅ Build starts with shebang");
} else {
    console.log("❌ Build is missing shebang — npx will fail!");
}
```

---

## 9. Client Configuration

### Claude Desktop

File: `claude_desktop_config.json`

```json
{
    "servers": {
        "my-server": {
            "command": "npx",
            "args": ["-y", "@scope/mcp-my-server"]
        }
    }
}
```

### VS Code (Copilot, Gemini, etc.)

File: `.vscode/mcp.json` at the project root

```json
{
    "servers": {
        "my-server": {
            "command": "npx",
            "args": ["-y", "@scope/mcp-my-server"]
        }
    }
}
```

### Google Antigravity

File: `~/.gemini/antigravity/mcp_config.json`

```json
{
    "mcpServers": {
        "my-server": {
            "command": "npx",
            "args": ["-y", "@scope/mcp-my-server"]
        }
    }
}
```

### OpenAI Codex CLI

File: `~/.codex/config.toml` (global) or `.codex/config.toml` (project)

```toml
[mcp_servers.my-server]
command = "npx"
args = ["-y", "@scope/mcp-my-server"]
```

### OpenCode

File: `opencode.json` at the project root

```json
{
    "mcp": {
        "my-server": {
            "command": "npx",
            "args": ["-y", "@scope/mcp-my-server"]
        }
    }
}
```

### GitHub Copilot (Agent Mode)

Same as VS Code — uses `.vscode/mcp.json`. Copilot in agent mode automatically
picks up MCP servers from this file.

### Environment variables

All clients support passing env variables to the MCP server process. Use this
for things like CWD override or API keys:

```json
{
    "servers": {
        "my-server": {
            "command": "npx",
            "args": ["-y", "@scope/mcp-my-server"],
            "env": {
                "cwd": "/path/to/project",
                "API_KEY": "secret"
            }
        }
    }
}
```

---

## 10. Publishing

### `package.json` checklist

- [ ] `"type": "module"` set
- [ ] `"bin"` points to `./build/index.js`
- [ ] `"files"` includes `["build", "README.md"]` (not `src/`)
- [ ] `"prepare": "npm run build"` — auto-builds on `npm install`
- [ ] Version bumped

### CI/CD with GitHub Actions

```yaml
name: Publish to NPM

on:
    release:
        types: [published]

jobs:
    build:
        runs-on: ubuntu-latest
        permissions:
            contents: read
            id-token: write
        steps:
            - uses: actions/checkout@v4
            - uses: actions/setup-node@v4
              with:
                  node-version: "22.x"
                  registry-url: "https://registry.npmjs.org"
            - run: npm ci
            - run: npm run build
            - run: npm test
            - run: npm publish --access public
              env:
                  NODE_AUTH_TOKEN: ${{ secrets.NODE_AUTH_TOKEN }}
```

### Pre-publish validation

Use Husky hooks to ensure quality:

```bash
# .husky/pre-commit
npm test

# .husky/pre-push
npm run build
npm test
```

---

## 11. Common Pitfalls

| Pitfall                                   | Consequence                                                 | Fix                                           |
| :---------------------------------------- | :---------------------------------------------------------- | :-------------------------------------------- |
| Missing `#!/usr/bin/env node`             | `npx` runs JS as shell script → `import: command not found` | Add shebang as first line of source           |
| `console.log()` in server code            | Corrupts MCP JSON-RPC protocol on stdout                    | Use `console.error()` for all logging         |
| Missing `"type": "module"`                | `import` syntax won't work                                  | Add to `package.json`                         |
| No timeout on `execSync`                  | Server hangs on interactive prompts                         | Set `timeout: 30_000`                         |
| No try/catch in `CallToolRequest` handler | Server crashes on tool errors                               | Wrap in try/catch, return `{ isError: true }` |
| Publishing `src/` in `"files"`            | Doubles package size, exposes source                        | Only include `build/`                         |
| No argument validation                    | Shell injection vulnerability                               | Validate with regex + Zod                     |
| Hardcoded version string                  | Version drift between package.json and server               | Read from `package.json` at runtime           |

---

## 12. Documentation Template

Every MCP server should ship with a `DOCUMENTATION.md` containing:

1. **Configuration examples** for each supported client (copy from Section 9)
2. **Available tools table** with tool name, underlying command, and extra args
3. **Security section** listing blacklisted commands and blocked characters
4. **Local development instructions** for contributors

And an `AGENTS.md` at the project root for AI coding assistants containing:

1. **Purpose** — what the MCP server does
2. **Architecture** — file structure overview
3. **Key conventions** — naming, mapping rules
4. **Testing** — how to run tests
5. **Publishing** — how releases work
