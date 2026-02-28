/**
 * Tool handler: dispatches tool calls to the appropriate logic
 */

import path from "path";
import { executeAceCommand, getProjectCwd, setProjectCwd } from "../services/ace.js";
import { toSnakeCase, createFileWithContent } from "../services/file_generator.js";
import { fetchDoc, listDocTopics } from "../services/docs.js";
import {
    MakeControllerArgsSchema,
    MakeServiceArgsSchema,
    MakeMigrationArgsSchema,
    MakeModelArgsSchema,
    MakeValidatorArgsSchema,
    MakeSeederArgsSchema,
    MakeExceptionArgsSchema,
    MakeMiddlewareArgsSchema,
    MakeTestArgsSchema,
    MakeFactoryArgsSchema,
    MakePolicyArgsSchema,
    MakeEventArgsSchema,
    MakeListenerArgsSchema,
    MakeMailerArgsSchema,
    MakeCommandArgsSchema,
    MakeRepositoryArgsSchema,
    MigrationRunArgsSchema,
    MigrationRollbackArgsSchema,
    DbSeedArgsSchema,
    SetProjectCwdArgsSchema,
    RunAceCommandArgsSchema,
    CheckDocsArgsSchema,
    ListDocsArgsSchema,
} from "./schemas.js";

interface ToolResult {
    [key: string]: unknown;
    content: { type: string; text: string }[];
    isError?: boolean;
}

function success(text: string): ToolResult {
    return { content: [{ type: "text", text }] };
}

export async function handleToolCall(toolName: string, args: unknown): Promise<ToolResult> {
    switch (toolName) {
        case "make_controller": {
            const parsed = MakeControllerArgsSchema.parse(args);
            const cmdArgs = parsed.resource ? [parsed.name, "--resource"] : [parsed.name];
            return success(`Controller created successfully:\n${executeAceCommand("make:controller", cmdArgs)}`);
        }

        case "make_service": {
            const parsed = MakeServiceArgsSchema.parse(args);
            return success(`Service created successfully:\n${executeAceCommand("make:service", [parsed.name])}`);
        }

        case "make_migration": {
            const parsed = MakeMigrationArgsSchema.parse(args);
            const cmdArgs = parsed.withModel ? [parsed.name, "-m"] : [parsed.name];
            return success(`Migration created successfully:\n${executeAceCommand("make:migration", cmdArgs)}`);
        }

        case "make_model": {
            const parsed = MakeModelArgsSchema.parse(args);
            return success(`Model created successfully:\n${executeAceCommand("make:model", [parsed.name])}`);
        }

        case "make_validator": {
            const parsed = MakeValidatorArgsSchema.parse(args);
            return success(`Validator created successfully:\n${executeAceCommand("make:validator", [parsed.name])}`);
        }

        case "make_seeder": {
            const parsed = MakeSeederArgsSchema.parse(args);
            return success(`Seeder created successfully:\n${executeAceCommand("make:seeder", [parsed.name])}`);
        }

        case "make_exception": {
            const parsed = MakeExceptionArgsSchema.parse(args);
            return success(`Exception created successfully:\n${executeAceCommand("make:exception", [parsed.name])}`);
        }

        case "make_middleware": {
            const parsed = MakeMiddlewareArgsSchema.parse(args);
            return success(`Middleware created successfully:\n${executeAceCommand("make:middleware", [parsed.name])}`);
        }

        case "make_test": {
            const parsed = MakeTestArgsSchema.parse(args);
            const cmdArgs = [parsed.name];
            if (parsed.suite) cmdArgs.push("--suite", parsed.suite);
            return success(`Test created successfully:\n${executeAceCommand("make:test", cmdArgs)}`);
        }

        case "make_factory": {
            const parsed = MakeFactoryArgsSchema.parse(args);
            return success(`Factory created successfully:\n${executeAceCommand("make:factory", [parsed.name])}`);
        }

        case "make_policy": {
            const parsed = MakePolicyArgsSchema.parse(args);
            return success(`Policy created successfully:\n${executeAceCommand("make:policy", [parsed.name])}`);
        }

        case "make_event": {
            const parsed = MakeEventArgsSchema.parse(args);
            return success(`Event created successfully:\n${executeAceCommand("make:event", [parsed.name])}`);
        }

        case "make_listener": {
            const parsed = MakeListenerArgsSchema.parse(args);
            return success(`Listener created successfully:\n${executeAceCommand("make:listener", [parsed.name])}`);
        }

        case "make_mailer": {
            const parsed = MakeMailerArgsSchema.parse(args);
            return success(`Mailer created successfully:\n${executeAceCommand("make:mailer", [parsed.name])}`);
        }

        case "make_command": {
            const parsed = MakeCommandArgsSchema.parse(args);
            return success(`Command created successfully:\n${executeAceCommand("make:command", [parsed.name])}`);
        }

        case "make_repository": {
            const parsed = MakeRepositoryArgsSchema.parse(args);
            const rawName = parsed.name.replace(/Repository$/i, "");
            const className = rawName.charAt(0).toUpperCase() + rawName.slice(1) + "Repository";
            const fileName = toSnakeCase(className) + ".ts";
            const filePath = path.join(getProjectCwd(), "app", "repositories", fileName);

            const template = `import { inject } from '@adonisjs/core'\n\n@inject()\nexport default class ${className} {\n}\n`;
            createFileWithContent(filePath, template);
            return success(`Repository created successfully:\nDONE:    create app/repositories/${fileName}`);
        }

        case "migration_run": {
            const parsed = MigrationRunArgsSchema.parse(args);
            const cmdArgs = parsed.force ? ["--force"] : [];
            return success(`Migrations executed successfully:\n${executeAceCommand("migration:run", cmdArgs)}`);
        }

        case "migration_rollback": {
            const parsed = MigrationRollbackArgsSchema.parse(args);
            const cmdArgs = parsed.batch ? ["--batch", String(parsed.batch)] : [];
            return success(`Rollback completed:\n${executeAceCommand("migration:rollback", cmdArgs)}`);
        }

        case "migration_status": {
            return success(`Migration status:\n${executeAceCommand("migration:status")}`);
        }

        case "db_seed": {
            const parsed = DbSeedArgsSchema.parse(args);
            const cmdArgs = parsed.files ? ["--files", parsed.files] : [];
            return success(`Seeding completed:\n${executeAceCommand("db:seed", cmdArgs)}`);
        }

        case "list_routes": {
            return success(`Routes:\n${executeAceCommand("list:routes")}`);
        }

        case "set_project_cwd": {
            const parsed = SetProjectCwdArgsSchema.parse(args);
            setProjectCwd(parsed.path);
            return success(`Project directory set to: ${getProjectCwd()}`);
        }

        case "run_ace_command": {
            const parsed = RunAceCommandArgsSchema.parse(args);
            return success(`Command executed successfully:\n${executeAceCommand(parsed.command, parsed.args)}`);
        }

        case "check_docs": {
            const parsed = CheckDocsArgsSchema.parse(args);
            const content = await fetchDoc(parsed.topic);
            return success(content);
        }

        case "list_docs": {
            const parsed = ListDocsArgsSchema.parse(args);
            const entries = listDocTopics(parsed.category);
            const lines = entries.map((e) => `- [${e.category}] ${e.topic}`);
            return success(`Available documentation topics (${entries.length}):\n${lines.join("\n")}`);
        }

        default:
            throw new Error(`Unknown tool: ${toolName}`);
    }
}
