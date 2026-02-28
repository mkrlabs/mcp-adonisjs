/**
 * MCP tool definitions exposed to AI assistants
 */

import { BLACKLISTED_COMMANDS } from "../services/security.js";
import { DOC_CATEGORIES } from "../services/docs.js";

export interface ToolDef {
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

export const TOOLS: ToolDef[] = [
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
    {
        name: "check_docs",
        description: "Fetches AdonisJS v7 official documentation for a given topic and returns it as markdown. Use list_docs first to see available topics and categories.",
        inputSchema: {
            type: "object",
            properties: {
                topic: { type: "string", description: "Documentation topic key (e.g., 'routing', 'lucid', 'session-guard')" },
            },
            required: ["topic"],
        },
    },
    {
        name: "list_docs",
        description: "Lists available AdonisJS v7 documentation topics. Optionally filter by category. Categories: " + DOC_CATEGORIES.join(", "),
        inputSchema: {
            type: "object",
            properties: {
                category: { type: "string", description: "Filter by category (e.g., 'basics', 'auth', 'database'). Omit to list all." },
            },
        },
    },
];
