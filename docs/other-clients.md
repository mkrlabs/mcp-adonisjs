# Other MCP Clients

For MCP clients not listed in this documentation, use the following generic
configuration.

## Core Configuration

| Property    | Value                            |
| :---------- | :------------------------------- |
| `command`   | `npx`                            |
| `args`      | `["-y", "@mkrlbs/mcp-adonisjs"]` |
| `transport` | `stdio`                          |

## JSON Format (Most Common)

```json
{
    "mcpServers": {
        "adonisjs": {
            "command": "npx",
            "args": ["-y", "@mkrlbs/mcp-adonisjs"]
        }
    }
}
```

## Specifying a Project Directory

If the client does not start in your project directory, set `cwd` or `env.cwd`:

```json
{
    "mcpServers": {
        "adonisjs": {
            "command": "npx",
            "args": ["-y", "@mkrlbs/mcp-adonisjs"],
            "cwd": "/path/to/my-adonis-project"
        }
    }
}
```

Or use the `env` block:

```json
{
    "mcpServers": {
        "adonisjs": {
            "command": "npx",
            "args": ["-y", "@mkrlbs/mcp-adonisjs"],
            "env": {
                "cwd": "/path/to/my-adonis-project"
            }
        }
    }
}
```

## Runtime Alternative

If your client does not support `cwd` in the config, call the `set_project_cwd`
tool after connecting to set the project directory.

---

[← Back to overview](README.md)
