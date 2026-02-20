---
name: blutui-project-guidelines
description: Guidelines for building Blutui projects. This skill should be used when writing, reviewing, or refactoring Blutui Canvas code.
license: MIT
metadata:
  author: Blutui
  version: "1.0.0"
---

# Blutui Project Guidelines

Contains 12 rules across 3 categories, prioritized by impact to guide automated refactoring and code generation.

## When to Apply

Reference these guidelines when:

- Writing new Blutui project templates, layouts, components, and more
- Refactoring existing frontend code

## Rule Categories by Priority

| Priority | Category | Impact | Prefix |
|----------|----------|--------|--------|
| 0 | Section 0 | MEDIUM | `undefined-` |
| 1 | Foundation | CRITICAL | `foundation-` |
| 2 | Templating | CRITICAL | `templating-` |

## Quick Reference

### 0. Section 0 (MEDIUM)

- `canopy` - Canopy
- `cassettes` - Cassettes - Project Version Control
- `collections` - Collections
- `courier` - Courier
- `forms` - Form Standards
- `mcp` - MCP
- `route-patterns` - Routing Pattern Standards

### 1. Foundation (CRITICAL)

- `foundation-courier-configuration` - Courier Configuration
- `foundation-file-structure` - File Structure
- `foundation-templates-and-layouts` - Templates and Layouts

### 2. Templating (CRITICAL)

- `templating-canvas` - Canvas
- `templating-including-templates` - Including other templates

## How to Use

Read individual rule files for detailed explanations and code examples:

```
rules/canopy.md
rules/foundation-courier-configuration.md
rules/templating-canvas.md
```

Each rule file contains:

- Brief explanation of why it matters

## Full Compiled Document

For the complete guide with all rules expanded: `AGENTS.md`
