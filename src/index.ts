#!/usr/bin/env node

import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from "@modelcontextprotocol/sdk/types.js";
import { z } from "zod";
import { execSync } from "child_process";

/**
 * Blacklisted commands that are considered dangerous
 */
const BLACKLISTED_COMMANDS = [
  "db:wipe",
  "migration:fresh",
  "migration:refresh",
  "migration:reset",
];

/**
 * Shell injection characters that are not allowed in command arguments
 */
const SHELL_INJECTION_PATTERN = /[;&|`$(){}[\]<>\\]/;

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
 * Executes an Ace command safely
 */
function executeAceCommand(command: string, args: string[] = []): string {
  // Check blacklist
  if (isBlacklisted(command)) {
    throw new Error(
      `Command "${command}" is blacklisted for security reasons. Blocked commands: ${BLACKLISTED_COMMANDS.join(", ")}`
    );
  }

  // Validate arguments
  validateArguments(args);

  // Build the command
  const fullCommand = `node ace ${command} ${args.join(" ")}`.trim();

  try {
    const output = execSync(fullCommand, {
      cwd: process.cwd(),
      encoding: "utf-8",
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
 * Schema definitions for tool arguments
 */
const MakeControllerArgsSchema = z.object({
  name: z.string().describe("Name of the controller to create"),
  resource: z
    .boolean()
    .optional()
    .default(false)
    .describe("Whether to create a resource controller"),
});

const MakeServiceArgsSchema = z.object({
  name: z.string().describe("Name of the service to create"),
});

const RunAceCommandArgsSchema = z.object({
  command: z.string().describe("The Ace command to run (e.g., 'make:model')"),
  args: z
    .array(z.string())
    .optional()
    .default([])
    .describe("Arguments to pass to the command"),
});

/**
 * Initialize the MCP server
 */
const server = new Server(
  {
    name: "adonisjs-mcp-server",
    version: "0.1.0",
  },
  {
    capabilities: {
      tools: {},
    },
  }
);

/**
 * Handler for listing available tools
 */
server.setRequestHandler(ListToolsRequestSchema, async () => {
  return {
    tools: [
      {
        name: "make_controller",
        description:
          "Creates an AdonisJS controller using the 'node ace make:controller' command",
        inputSchema: {
          type: "object",
          properties: {
            name: {
              type: "string",
              description: "Name of the controller to create",
            },
            resource: {
              type: "boolean",
              description: "Whether to create a resource controller",
              default: false,
            },
          },
          required: ["name"],
        },
      },
      {
        name: "make_service",
        description:
          "Creates an AdonisJS service using the 'node ace make:service' command",
        inputSchema: {
          type: "object",
          properties: {
            name: {
              type: "string",
              description: "Name of the service to create",
            },
          },
          required: ["name"],
        },
      },
      {
        name: "run_ace_command",
        description:
          "Executes an AdonisJS Ace command with security checks. Blacklisted commands: " +
          BLACKLISTED_COMMANDS.join(", "),
        inputSchema: {
          type: "object",
          properties: {
            command: {
              type: "string",
              description: "The Ace command to run (e.g., 'make:model')",
            },
            args: {
              type: "array",
              items: {
                type: "string",
              },
              description: "Arguments to pass to the command",
              default: [],
            },
          },
          required: ["command"],
        },
      },
    ],
  };
});

/**
 * Handler for executing tools
 */
server.setRequestHandler(CallToolRequestSchema, async (request) => {
  try {
    const { name, arguments: args } = request.params;

    switch (name) {
      case "make_controller": {
        const parsed = MakeControllerArgsSchema.parse(args);
        const commandArgs = parsed.resource ? [parsed.name, "--resource"] : [parsed.name];
        const output = executeAceCommand("make:controller", commandArgs);
        return {
          content: [
            {
              type: "text",
              text: `Controller created successfully:\n${output}`,
            },
          ],
        };
      }

      case "make_service": {
        const parsed = MakeServiceArgsSchema.parse(args);
        const output = executeAceCommand("make:service", [parsed.name]);
        return {
          content: [
            {
              type: "text",
              text: `Service created successfully:\n${output}`,
            },
          ],
        };
      }

      case "run_ace_command": {
        const parsed = RunAceCommandArgsSchema.parse(args);
        const output = executeAceCommand(parsed.command, parsed.args);
        return {
          content: [
            {
              type: "text",
              text: `Command executed successfully:\n${output}`,
            },
          ],
        };
      }

      default:
        throw new Error(`Unknown tool: ${name}`);
    }
  } catch (error: any) {
    return {
      content: [
        {
          type: "text",
          text: `Error: ${error.message}`,
        },
      ],
      isError: true,
    };
  }
});

/**
 * Start the server
 */
async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  // Use stderr for logging since stdout is used for MCP protocol communication
  console.error("AdonisJS MCP Server running on stdio");
}

main().catch((error) => {
  console.error("Fatal error:", error);
  process.exit(1);
});
