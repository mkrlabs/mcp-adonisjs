/**
 * AdonisJS project context and Ace command execution
 */

import { execSync } from "child_process";
import fs from "fs";
import path from "path";
import { isBlacklisted, validateArguments, BLACKLISTED_COMMANDS } from "./security.js";

let projectCwd: string = process.cwd();

export function getProjectCwd(): string {
    return projectCwd;
}

export function setProjectCwd(cwd: string): void {
    const resolved = path.resolve(cwd);
    if (!fs.existsSync(resolved)) {
        throw new Error(`Directory not found: ${resolved}`);
    }
    const hasAce = fs.existsSync(path.join(resolved, "ace")) || fs.existsSync(path.join(resolved, "ace.js"));
    if (!hasAce) {
        throw new Error(`No 'ace' entry point found in ${resolved}. Is this an AdonisJS project?`);
    }
    projectCwd = resolved;
}

export function verifyAdonisProject(): void {
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

export function executeAceCommand(command: string, args: string[] = []): string {
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
