/**
 * Zod schemas for tool argument validation
 */

import { z } from "zod";

export const MakeControllerArgsSchema = z.object({
    name: z.string().describe("Name of the controller to create"),
    resource: z.boolean().optional().default(false).describe("Whether to create a resource controller"),
});

export const MakeServiceArgsSchema = z.object({
    name: z.string().describe("Name of the service to create"),
});

export const MakeMigrationArgsSchema = z.object({
    name: z.string().describe("Name of the migration (e.g., 'create_projects_table')"),
    withModel: z.boolean().optional().default(false).describe("Also create the corresponding model (-m flag)"),
});

export const MakeModelArgsSchema = z.object({
    name: z.string().describe("Name of the model to create (e.g., 'Project')"),
});

export const MakeValidatorArgsSchema = z.object({
    name: z.string().describe("Name of the validator to create (e.g., 'project')"),
});

export const MakeSeederArgsSchema = z.object({
    name: z.string().describe("Name of the seeder to create (e.g., 'project')"),
});

export const MakeExceptionArgsSchema = z.object({
    name: z.string().describe("Name of the exception to create (e.g., 'UnauthorizedException')"),
});

export const MakeMiddlewareArgsSchema = z.object({
    name: z.string().describe("Name of the middleware to create (e.g., 'auth')"),
});

export const MakeTestArgsSchema = z.object({
    name: z.string().describe("Name of the test file to create (e.g., 'users/list')"),
    suite: z.enum(["unit", "functional", "browser"]).optional().describe("Test suite to create the test in"),
});

export const MakeFactoryArgsSchema = z.object({
    name: z.string().describe("Name of the factory to create (e.g., 'User')"),
});

export const MakePolicyArgsSchema = z.object({
    name: z.string().describe("Name of the policy to create (e.g., 'project')"),
});

export const MakeEventArgsSchema = z.object({
    name: z.string().describe("Name of the event to create (e.g., 'UserRegistered')"),
});

export const MakeListenerArgsSchema = z.object({
    name: z.string().describe("Name of the listener to create (e.g., 'SendWelcomeEmail')"),
});

export const MakeMailerArgsSchema = z.object({
    name: z.string().describe("Name of the mailer to create (e.g., 'VerificationMailer')"),
});

export const MakeCommandArgsSchema = z.object({
    name: z.string().describe("Name of the command to create (e.g., 'SyncUsers')"),
});

export const MakeRepositoryArgsSchema = z.object({
    name: z.string().describe("Name of the repository to create (e.g., 'User', 'Project')"),
});

export const MigrationRunArgsSchema = z.object({
    force: z.boolean().optional().default(false).describe("Force run in production"),
});

export const MigrationRollbackArgsSchema = z.object({
    batch: z.number().optional().describe("Batch number to rollback to (default: last batch)"),
});

export const DbSeedArgsSchema = z.object({
    files: z.string().optional().describe("Specific seeder file to run (e.g., 'database/seeders/user_seeder')"),
});

export const SetProjectCwdArgsSchema = z.object({
    path: z.string().describe("Absolute path to the AdonisJS project root directory"),
});

export const RunAceCommandArgsSchema = z.object({
    command: z.string().describe("The Ace command to run (e.g., 'make:model')"),
    args: z.array(z.string()).optional().default([]).describe("Arguments to pass to the command"),
});

export const CheckDocsArgsSchema = z.object({
    topic: z.string().describe("Documentation topic key (e.g., 'routing', 'lucid', 'session-guard'). Use list_docs to see available topics."),
});

export const ListDocsArgsSchema = z.object({
    category: z.string().optional().describe("Filter by category (e.g., 'basics', 'auth', 'database'). Omit to list all topics."),
});

