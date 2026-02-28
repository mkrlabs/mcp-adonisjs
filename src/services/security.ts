/**
 * Security utilities: blacklist, shell injection validation
 */

export const BLACKLISTED_COMMANDS = [
    "migration:fresh",
];

export const SHELL_INJECTION_PATTERN = /[;&|`$<>\\]/;

export function validateArguments(args: string[]): void {
    for (const arg of args) {
        if (SHELL_INJECTION_PATTERN.test(arg)) {
            throw new Error(
                `Invalid argument "${arg}": contains potentially dangerous characters`
            );
        }
    }
}

export function isBlacklisted(command: string): boolean {
    return BLACKLISTED_COMMANDS.includes(command);
}
