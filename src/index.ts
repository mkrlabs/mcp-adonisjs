#!/usr/bin/env node
import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
    CallToolRequestSchema,
    ListToolsRequestSchema,
} from "@modelcontextprotocol/sdk/types.js";
import { z } from "zod";
import { execSync } from "child_process";
import fs from "fs";
import path from "path";
import { createRequire } from "module";

const require = createRequire(import.meta.url);
const { version: PKG_VERSION } = require("../package.json");

/**
 * Project working directory — set via env, set_project_cwd tool, or defaults to process.cwd()
 */
let projectCwd: string = process.cwd();

function getProjectCwd(): string {
    return projectCwd;
}

/**
 * Blacklisted commands that are considered dangerous
 */
const BLACKLISTED_COMMANDS = [
    "migration:fresh",
];

/**
 * Shell injection characters that are not allowed in command arguments
 */
const SHELL_INJECTION_PATTERN = /[;&|`$<>\\]/;

/**
 * Validates that command arguments don't contain shell injection characters
 */
function validateArguments(args: string[]): void {
    for (const arg of args) {
        if (SHELL_INJECTION_PATTERN.test(arg)) {
            throw new Error(
                `Invalid argument "${arg}": contains potentially dangerous characters`
            );
        }
    }
}

/**
 * Checks if a command is blacklisted
 */
function isBlacklisted(command: string): boolean {
    return BLACKLISTED_COMMANDS.includes(command);
}

/**
 * Verify that we are in an AdonisJS project
 */
function verifyAdonisProject(): void {
    const cwd = getProjectCwd();
    const acePath = path.join(cwd, "ace");
    const aceJsPath = path.join(cwd, "ace.js");

    if (!fs.existsSync(acePath) && !fs.existsSync(aceJsPath)) {
        throw new Error(
            `AdonisJS 'ace' entry point not found in directory (${cwd}).\n` +
            `Please use the set_project_cwd tool to set the path to your AdonisJS project, ` +
            `or configure the 'cwd' environment variable.`
        );
    }
}

/**
 * Executes an Ace command safely
 */
function executeAceCommand(command: string, args: string[] = []): string {
    verifyAdonisProject();

    if (isBlacklisted(command)) {
        throw new Error(
            `Command "${command}" is blacklisted for security reasons. Blocked commands: ${BLACKLISTED_COMMANDS.join(", ")}`
        );
    }

    validateArguments(args);

    const fullCommand = `node ace ${command} ${args.join(" ")}`.trim();

    try {
        const output = execSync(fullCommand, {
            cwd: getProjectCwd(),
            encoding: "utf-8",
            timeout: 30_000,
            stdio: ["pipe", "pipe", "pipe"],
        });
        return output;
    } catch (error: any) {
        throw new Error(
            `Command execution failed: ${error.message}\nStderr: ${error.stderr || "N/A"}`
        );
    }
}

/**
 * Converts PascalCase or camelCase to snake_case
 */
function toSnakeCase(str: string): string {
    return str
        .replace(/([A-Z])/g, "_$1")
        .toLowerCase()
        .replace(/^_/, "");
}

/**
 * Creates a file with the given content, ensuring the directory exists
 */
function createFileWithContent(filePath: string, content: string): string {
    const dir = path.dirname(filePath);
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
    }
    if (fs.existsSync(filePath)) {
        throw new Error(`File already exists: ${filePath}`);
    }
    fs.writeFileSync(filePath, content, "utf-8");
    return filePath;
}

// ─── Schema Definitions ─────────────────────────────────────────────────────

const MakeControllerArgsSchema = z.object({
    name: z.string().describe("Name of the controller to create"),
    resource: z.boolean().optional().default(false).describe("Whether to create a resource controller"),
});

const MakeServiceArgsSchema = z.object({
    name: z.string().describe("Name of the service to create"),
});

const MakeMigrationArgsSchema = z.object({
    name: z.string().describe("Name of the migration (e.g., 'create_projects_table')"),
    withModel: z.boolean().optional().default(false).describe("Also create the corresponding model (-m flag)"),
});

const MakeModelArgsSchema = z.object({
    name: z.string().describe("Name of the model to create (e.g., 'Project')"),
});

const MakeValidatorArgsSchema = z.object({
    name: z.string().describe("Name of the validator to create (e.g., 'project')"),
});

const MakeSeederArgsSchema = z.object({
    name: z.string().describe("Name of the seeder to create (e.g., 'project')"),
});

const MakeExceptionArgsSchema = z.object({
    name: z.string().describe("Name of the exception to create (e.g., 'UnauthorizedException')"),
});

const MakeMiddlewareArgsSchema = z.object({
    name: z.string().describe("Name of the middleware to create (e.g., 'auth')"),
});

const MakeTestArgsSchema = z.object({
    name: z.string().describe("Name of the test file to create (e.g., 'users/list')"),
    suite: z.enum(["unit", "functional", "browser"]).optional().describe("Test suite to create the test in"),
});

const MakeFactoryArgsSchema = z.object({
    name: z.string().describe("Name of the factory to create (e.g., 'User')"),
});

const MakePolicyArgsSchema = z.object({
    name: z.string().describe("Name of the policy to create (e.g., 'project')"),
});

const MakeEventArgsSchema = z.object({
    name: z.string().describe("Name of the event to create (e.g., 'UserRegistered')"),
});

const MakeListenerArgsSchema = z.object({
    name: z.string().describe("Name of the listener to create (e.g., 'SendWelcomeEmail')"),
});

const MakeMailerArgsSchema = z.object({
    name: z.string().describe("Name of the mailer to create (e.g., 'VerificationMailer')"),
});

const MakeCommandArgsSchema = z.object({
    name: z.string().describe("Name of the command to create (e.g., 'SyncUsers')"),
});

const MakeRepositoryArgsSchema = z.object({
    name: z.string().describe("Name of the repository to create (e.g., 'User', 'Project')"),
});

const MigrationRunArgsSchema = z.object({
    force: z.boolean().optional().default(false).describe("Force run in production"),
});

const MigrationRollbackArgsSchema = z.object({
    batch: z.number().optional().describe("Batch number to rollback to (default: last batch)"),
});

const DbSeedArgsSchema = z.object({
    files: z.string().optional().describe("Specific seeder file to run (e.g., 'database/seeders/user_seeder')"),
});

const SetProjectCwdArgsSchema = z.object({
    path: z.string().describe("Absolute path to the AdonisJS project root directory"),
});

const RunAceCommandArgsSchema = z.object({
    command: z.string().describe("The Ace command to run (e.g., 'make:model')"),
    args: z.array(z.string()).optional().default([]).describe("Arguments to pass to the command"),
});

// ─── Tool Definitions ────────────────────────────────────────────────────────

interface ToolDef {
    name: string;
    description: string;
    inputSchema: Record<string, any>;
}

function simpleNameTool(name: string, description: string, paramDesc: string): ToolDef {
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

const TOOLS: ToolDef[] = [
    {
        name: "make_controller",
        description: "Creates an AdonisJS controller using 'node ace make:controller'",
        inputSchema: {
            type: "object",
            properties: {
                name: { type: "string", description: "Name of the controller to create" },
                resource: { type: "boolean", description: "Whether to create a resource controller", default: false },
            },
            required: ["name"],
        },
    },
    simpleNameTool("make_service", "Creates an AdonisJS service using 'node ace make:service'", "Name of the service"),
    {
        name: "make_migration",
        description: "Creates an AdonisJS migration using 'node ace make:migration'. Use withModel to also create the model (-m flag).",
        inputSchema: {
            type: "object",
            properties: {
                name: { type: "string", description: "Name of the migration (e.g., 'create_projects_table')" },
                withModel: { type: "boolean", description: "Also create the corresponding model (-m flag)", default: false },
            },
            required: ["name"],
        },
    },
    simpleNameTool("make_model", "Creates an AdonisJS Lucid model using 'node ace make:model'", "Name of the model (e.g., 'Project')"),
    simpleNameTool("make_validator", "Creates an AdonisJS VineJS validator using 'node ace make:validator'", "Name of the validator (e.g., 'project')"),
    simpleNameTool("make_seeder", "Creates an AdonisJS database seeder using 'node ace make:seeder'", "Name of the seeder (e.g., 'project')"),
    simpleNameTool("make_exception", "Creates an AdonisJS custom exception using 'node ace make:exception'", "Name of the exception (e.g., 'UnauthorizedException')"),
    simpleNameTool("make_middleware", "Creates an AdonisJS middleware using 'node ace make:middleware'", "Name of the middleware (e.g., 'auth')"),
    {
        name: "make_test",
        description: "Creates a Japa test file using 'node ace make:test'",
        inputSchema: {
            type: "object",
            properties: {
                name: { type: "string", description: "Name of the test (e.g., 'users/list')" },
                suite: { type: "string", enum: ["unit", "functional", "browser"], description: "Test suite" },
            },
            required: ["name"],
        },
    },
    simpleNameTool("make_factory", "Creates a Lucid model factory using 'node ace make:factory'", "Name of the factory (e.g., 'User')"),
    simpleNameTool("make_policy", "Creates a bouncer policy using 'node ace make:policy'", "Name of the policy (e.g., 'project')"),
    simpleNameTool("make_event", "Creates an AdonisJS event using 'node ace make:event'", "Name of the event (e.g., 'UserRegistered')"),
    simpleNameTool("make_listener", "Creates an AdonisJS event listener using 'node ace make:listener'", "Name of the listener (e.g., 'SendWelcomeEmail')"),
    simpleNameTool("make_mailer", "Creates an AdonisJS mailer using 'node ace make:mailer'", "Name of the mailer (e.g., 'VerificationMailer')"),
    simpleNameTool("make_command", "Creates an AdonisJS Ace command using 'node ace make:command'", "Name of the command (e.g., 'SyncUsers')"),
    simpleNameTool("make_repository", "Creates a repository class in app/repositories/. AdonisJS has no built-in make:repository command so this tool generates the file directly.", "Name of the repository (e.g., 'User', 'Project')"),
    {
        name: "migration_run",
        description: "Runs pending database migrations using 'node ace migration:run'. Auto-generates database/schema.ts.",
        inputSchema: {
            type: "object",
            properties: {
                force: { type: "boolean", description: "Force run in production", default: false },
            },
        },
    },
    {
        name: "migration_rollback",
        description: "Rolls back the last batch of migrations using 'node ace migration:rollback'",
        inputSchema: {
            type: "object",
            properties: {
                batch: { type: "number", description: "Batch number to rollback to (default: last batch)" },
            },
        },
    },
    {
        name: "migration_status",
        description: "Shows the status of all migrations using 'node ace migration:status'",
        inputSchema: { type: "object", properties: {} },
    },
    {
        name: "db_seed",
        description: "Runs database seeders using 'node ace db:seed'",
        inputSchema: {
            type: "object",
            properties: {
                files: { type: "string", description: "Specific seeder file to run (e.g., 'database/seeders/user_seeder')" },
            },
        },
    },
    {
        name: "list_routes",
        description: "Lists all registered routes using 'node ace list:routes'",
        inputSchema: { type: "object", properties: {} },
    },
    {
        name: "set_project_cwd",
        description: "Sets the working directory for all subsequent Ace commands. Call this first if the server cannot find the AdonisJS project. The path must point to a directory containing the 'ace' file.",
        inputSchema: {
            type: "object",
            properties: {
                path: { type: "string", description: "Absolute path to the AdonisJS project root directory" },
            },
            required: ["path"],
        },
    },
    {
        name: "run_ace_command",
        description: "Executes any AdonisJS Ace command with security checks. Use this for commands without a dedicated tool. Blacklisted: " + BLACKLISTED_COMMANDS.join(", "),
        inputSchema: {
            type: "object",
            properties: {
                command: { type: "string", description: "The Ace command to run" },
                args: { type: "array", items: { type: "string" }, description: "Arguments to pass", default: [] },
            },
            required: ["command"],
        },
    },
];

// ─── Server Setup ────────────────────────────────────────────────────────────

const server = new Server(
    { name: "adonisjs-mcp-server", version: PKG_VERSION },
    { capabilities: { tools: {} } }
);

server.setRequestHandler(ListToolsRequestSchema, async () => {
    return { tools: TOOLS };
});

// ─── Tool Handlers ───────────────────────────────────────────────────────────

server.setRequestHandler(CallToolRequestSchema, async (request) => {
    try {
        const { name, arguments: args } = request.params;

        switch (name) {
            case "make_controller": {
                const parsed = MakeControllerArgsSchema.parse(args);
                const cmdArgs = parsed.resource ? [parsed.name, "--resource"] : [parsed.name];
                const output = executeAceCommand("make:controller", cmdArgs);
                return { content: [{ type: "text", text: `Controller created successfully:\n${output}` }] };
            }

            case "make_service": {
                const parsed = MakeServiceArgsSchema.parse(args);
                const output = executeAceCommand("make:service", [parsed.name]);
                return { content: [{ type: "text", text: `Service created successfully:\n${output}` }] };
            }

            case "make_migration": {
                const parsed = MakeMigrationArgsSchema.parse(args);
                const cmdArgs = parsed.withModel ? [parsed.name, "-m"] : [parsed.name];
                const output = executeAceCommand("make:migration", cmdArgs);
                return { content: [{ type: "text", text: `Migration created successfully:\n${output}` }] };
            }

            case "make_model": {
                const parsed = MakeModelArgsSchema.parse(args);
                const output = executeAceCommand("make:model", [parsed.name]);
                return { content: [{ type: "text", text: `Model created successfully:\n${output}` }] };
            }

            case "make_validator": {
                const parsed = MakeValidatorArgsSchema.parse(args);
                const output = executeAceCommand("make:validator", [parsed.name]);
                return { content: [{ type: "text", text: `Validator created successfully:\n${output}` }] };
            }

            case "make_seeder": {
                const parsed = MakeSeederArgsSchema.parse(args);
                const output = executeAceCommand("make:seeder", [parsed.name]);
                return { content: [{ type: "text", text: `Seeder created successfully:\n${output}` }] };
            }

            case "make_exception": {
                const parsed = MakeExceptionArgsSchema.parse(args);
                const output = executeAceCommand("make:exception", [parsed.name]);
                return { content: [{ type: "text", text: `Exception created successfully:\n${output}` }] };
            }

            case "make_middleware": {
                const parsed = MakeMiddlewareArgsSchema.parse(args);
                const output = executeAceCommand("make:middleware", [parsed.name]);
                return { content: [{ type: "text", text: `Middleware created successfully:\n${output}` }] };
            }

            case "make_test": {
                const parsed = MakeTestArgsSchema.parse(args);
                const cmdArgs = [parsed.name];
                if (parsed.suite) cmdArgs.push("--suite", parsed.suite);
                const output = executeAceCommand("make:test", cmdArgs);
                return { content: [{ type: "text", text: `Test created successfully:\n${output}` }] };
            }

            case "make_factory": {
                const parsed = MakeFactoryArgsSchema.parse(args);
                const output = executeAceCommand("make:factory", [parsed.name]);
                return { content: [{ type: "text", text: `Factory created successfully:\n${output}` }] };
            }

            case "make_policy": {
                const parsed = MakePolicyArgsSchema.parse(args);
                const output = executeAceCommand("make:policy", [parsed.name]);
                return { content: [{ type: "text", text: `Policy created successfully:\n${output}` }] };
            }

            case "make_event": {
                const parsed = MakeEventArgsSchema.parse(args);
                const output = executeAceCommand("make:event", [parsed.name]);
                return { content: [{ type: "text", text: `Event created successfully:\n${output}` }] };
            }

            case "make_listener": {
                const parsed = MakeListenerArgsSchema.parse(args);
                const output = executeAceCommand("make:listener", [parsed.name]);
                return { content: [{ type: "text", text: `Listener created successfully:\n${output}` }] };
            }

            case "make_mailer": {
                const parsed = MakeMailerArgsSchema.parse(args);
                const output = executeAceCommand("make:mailer", [parsed.name]);
                return { content: [{ type: "text", text: `Mailer created successfully:\n${output}` }] };
            }

            case "make_command": {
                const parsed = MakeCommandArgsSchema.parse(args);
                const output = executeAceCommand("make:command", [parsed.name]);
                return { content: [{ type: "text", text: `Command created successfully:\n${output}` }] };
            }

            case "migration_run": {
                const parsed = MigrationRunArgsSchema.parse(args);
                const cmdArgs = parsed.force ? ["--force"] : [];
                const output = executeAceCommand("migration:run", cmdArgs);
                return { content: [{ type: "text", text: `Migrations executed successfully:\n${output}` }] };
            }

            case "migration_rollback": {
                const parsed = MigrationRollbackArgsSchema.parse(args);
                const cmdArgs = parsed.batch ? ["--batch", String(parsed.batch)] : [];
                const output = executeAceCommand("migration:rollback", cmdArgs);
                return { content: [{ type: "text", text: `Rollback completed:\n${output}` }] };
            }

            case "migration_status": {
                const output = executeAceCommand("migration:status");
                return { content: [{ type: "text", text: `Migration status:\n${output}` }] };
            }

            case "db_seed": {
                const parsed = DbSeedArgsSchema.parse(args);
                const cmdArgs = parsed.files ? ["--files", parsed.files] : [];
                const output = executeAceCommand("db:seed", cmdArgs);
                return { content: [{ type: "text", text: `Seeding completed:\n${output}` }] };
            }

            case "make_repository": {
                const parsed = MakeRepositoryArgsSchema.parse(args);
                const rawName = parsed.name.replace(/Repository$/i, "");
                const className = rawName.charAt(0).toUpperCase() + rawName.slice(1) + "Repository";
                const fileName = toSnakeCase(className) + ".ts";
                const filePath = path.join(getProjectCwd(), "app", "repositories", fileName);

                const template = `import { inject } from '@adonisjs/core'

@inject()
export default class ${className} {
}
`;
                createFileWithContent(filePath, template);
                return { content: [{ type: "text", text: `Repository created successfully:\nDONE:    create app/repositories/${fileName}` }] };
            }

            case "list_routes": {
                const output = executeAceCommand("list:routes");
                return { content: [{ type: "text", text: `Routes:\n${output}` }] };
            }

            case "set_project_cwd": {
                const parsed = SetProjectCwdArgsSchema.parse(args);
                const targetPath = path.resolve(parsed.path);
                if (!fs.existsSync(targetPath)) {
                    throw new Error(`Directory not found: ${targetPath}`);
                }
                const hasAce = fs.existsSync(path.join(targetPath, "ace")) || fs.existsSync(path.join(targetPath, "ace.js"));
                if (!hasAce) {
                    throw new Error(`No 'ace' entry point found in ${targetPath}. Is this an AdonisJS project?`);
                }
                projectCwd = targetPath;
                return { content: [{ type: "text", text: `Project directory set to: ${targetPath}` }] };
            }

            case "run_ace_command": {
                const parsed = RunAceCommandArgsSchema.parse(args);
                const output = executeAceCommand(parsed.command, parsed.args);
                return { content: [{ type: "text", text: `Command executed successfully:\n${output}` }] };
            }

            default:
                throw new Error(`Unknown tool: ${name}`);
        }
    } catch (error: any) {
        return {
            content: [{ type: "text", text: `Error: ${error.message}` }],
            isError: true,
        };
    }
});

// ─── Start ───────────────────────────────────────────────────────────────────

async function main() {
    const targetCwd = process.env.cwd || process.env.CWD;
    if (targetCwd) {
        try {
            const resolved = path.resolve(targetCwd);
            projectCwd = resolved;
            console.error(`Project directory set to: ${resolved}`);
        } catch (err) {
            console.error(`Failed to set project directory to ${targetCwd}:`, err);
        }
    }

    const transport = new StdioServerTransport();
    await server.connect(transport);
    console.error("AdonisJS MCP Server running on stdio");
    console.error(`Current working directory: ${process.cwd()}`);
}

main().catch((error) => {
    console.error("Fatal error:", error);
    process.exit(1);
});
