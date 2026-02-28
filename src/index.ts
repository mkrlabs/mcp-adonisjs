#!/usr/bin/env node

/**
 * AdonisJS MCP Server — entry point
 */

import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
    CallToolRequestSchema,
    ListToolsRequestSchema,
} from "@modelcontextprotocol/sdk/types.js";
import path from "path";
import { createRequire } from "module";

import { setProjectCwd } from "./services/ace.js";
import { TOOLS } from "./tools/definitions.js";
import { handleToolCall } from "./tools/handlers.js";

const require = createRequire(import.meta.url);
const { version: PKG_VERSION } = require("../package.json");

// ─── Server Setup ────────────────────────────────────────────────────────────

const server = new Server(
    { name: "adonisjs-mcp-server", version: PKG_VERSION },
    { capabilities: { tools: {} } }
);

server.setRequestHandler(ListToolsRequestSchema, async () => {
    return { tools: TOOLS };
});

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

// ─── Start ───────────────────────────────────────────────────────────────────

async function main() {
    const targetCwd = process.env.cwd || process.env.CWD;
    if (targetCwd) {
        try {
            setProjectCwd(path.resolve(targetCwd));
            console.error(`Project directory set to: ${targetCwd}`);
        } catch (err) {
            console.error(`Failed to set project directory to ${targetCwd}:`, err);
        }
    }

    const transport = new StdioServerTransport();
    await server.connect(transport);
    console.error("AdonisJS MCP Server running on stdio");
    console.error(`Working directory: ${process.cwd()}`);
}

main().catch((error) => {
    console.error("Fatal error:", error);
    process.exit(1);
});
