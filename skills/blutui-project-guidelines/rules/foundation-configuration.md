---
title: Configuration
impact: CRITICAL
impactDescription: This configuration file is the core dependency for all Courier operations, Blutui MCP connectivity, and Cassette management. Loss or corruption will halt development workflows and severely degrade system performance.
tags: config, handle, cassette, courier.json, login, mcp
---

## Configuring Courier

The handle is a required property in the `courier.json` file located in the root directory of the project. It specifies the unique identifier for the Blutui project. The agent must always prompt the user to provide the `handle` property. The agent must not attempt to guess or fabricate a handle. A missing handle could be one of the reasons for failure of Blutui mcp tool calls.

The cassette specified in the `courier.json` file determines which version of the project is active.

**Prior to making any changes to the `courier.json` file, the agent must confirm if the user has logged in using
the command below and add the token.txt file to the root directory of the project. If the user has not done this, the agent must instruct the user to complete this step first.**

```bash
courier login --token < token.txt
```

```json
{
  "cassette": "default",
  "handle": "project-handle"
}
```

**After making any changes to the `courier.json` file, the agent must instruct the user to restart the Blutui MCP server.**

Reference: [Link to documentation](https://dev.blutui.com/docs/courier/configuration)
