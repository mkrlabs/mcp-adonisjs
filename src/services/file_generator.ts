/**
 * File generation utilities for non-Ace scaffolding (e.g., repositories)
 */

import fs from "fs";
import path from "path";

export function toSnakeCase(str: string): string {
    return str
        .replace(/([A-Z])/g, "_$1")
        .toLowerCase()
        .replace(/^_/, "");
}

export function createFileWithContent(filePath: string, content: string): string {
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
