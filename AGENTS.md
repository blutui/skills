# Blutui Project Guidelines

The Blutui Project guidelines are specifically curated by Blutui maintainers for this project. These guidelines should be followed closely to enhance the user's satisfaction in building a Blutui project.


  ---
  **Version:** 1.0.0
  **Organization:** Blutui
  **Date:** January 2026
  ---
  **References:**
- https://dev.blutui.com

# Blutui Project Guidelines

The Blutui Project guidelines are specifically curated by Blutui maintainers for this project. These guidelines should be followed closely to enhance the user's satisfaction in building a Blutui project.

---

**Version:** 1.0.0
**Organization:** Blutui
**Date:** January 2026

**References:**
- https://dev.blutui.com

---

---
name: blutui-project-guidelines
description: The Blutui Project guidelines are specifically curated by Blutui maintainers for this project. These guidelines should be followed closely to enhance the user's satisfaction in building a Blutui project.
license: MIT
metadata:
  author: Blutui
  version: "1.0.0"
---

# Blutui Project Guidelines

Comprehensive guide for Blutui projects, maintained by Blutui. Contains 45 rules across 8 categories, prioritized by impact to guide automated refactoring and code generation.

## When to Apply

Reference these guidelines when:
- Creating a new Blutui project with/without a template
- Editing an existing Blutui project

## Rule Categories by Priority

| Priority | Category | Impact | Prefix |
|----------|----------|--------|--------|
| 1 | Foundation | CRITICAL | `foundation-` |
| 2 | Model Context Protocol (MCP) | HIGH | `mcp-` |
| 3 | Canvas | CRITICAL | `canvas-` |
| 4 | Courier | MEDIUM | `courier-` |
| 5 | Cassette | LOW | `cassette-` |
| 6 | Collections | CRITICAL | `collections-` |
| 7 | Canopy | MEDIUM | `canopy-` |

## Quick Reference

### 1. Foundation (CRITICAL)

- `foundation-configuration` - Use to add or update a project configuration file
- `foundation-file-structure` - Use to understand the file structure of the project
- `foundation-templates-and-layouts` - Use to understand what templates, layouts and pages file should contain
- `foundation-form` - Use to create and update forms using Blutui syntax
- `foundation-route-pattern` - Use to create route patterns

### 2. Model Context Protocol (MCP) (HIGH)

- `mcp` - Use when utilising or suggested to utilise Blutui MCP

### 3. Canvas (CRITICAL)

- `canvas` - Use to write code using Blutui syntax

### 4. Courier (CRITICAL)

- `courier` - Use to understand Blutui CLI capabilities

### 5. Cassettes (LOW)

- `cassettes` - Use for project version control

### 6. Collections (CRITICAL)

- `collections` - Use to manage dynamic data

### 7. Canopy (MEDIUM)

- `canopy` - Use to define in-page editor functions

## How to Use

Read individual rule files for detailed explanations and code examples:

```
rules/canvas.md
rules/mcp.md
rules/_sections.md
```

Each rule file contains:
- Brief explanation of why it matters
- Explanation on what, when or how to use it with examples
- Additional context and references to the documentation

## Full Compiled Document

For the complete guide with all rules expanded: `AGENTS.md`



