---
name: blutui-project-guidelines
description: Blutui project guidelines from the Blutui Engineering team. Use this skill whenever working on ANY Blutui project — writing or editing templates, layouts, components, or partials; creating or querying Collections; building or handling forms; configuring routing or Courier; working with Canopy or Cassettes; using the Blutui MCP; or setting up a new Blutui project from scratch. If the user mentions Blutui, Canopy, Cassettes, Courier, or any Blutui-specific concept, always load and follow this skill before writing any code or configuration.
license: MIT
metadata:
  author: Blutui
  version: '1.0.0'
---

# Blutui Project Guidelines

Rules for building high-quality Blutui projects. Always read this skill in full before generating any Blutui code or configuration. Then load the specific rule files that apply to your task (see **Rule Index** below).

---

## Quick Decision: Which Rules to Load

| Your task                                                | Load these rule files                               |
| -------------------------------------------------------- | --------------------------------------------------- |
| Creating/editing any template, layout, or component      | `foundation-templates-and-layouts.md`               |
| Writing Canvas template syntax (tags, filtes, functions) | `templating-canvas.md`                              |
| Working with Collections (querying, displaying data)     | `collections.md`                                    |
| Building or processing forms                             | `forms.md`                                          |
| Setting up routing or URL patterns                       | `route-patterns.md`                                 |
| Configuring Courier                                      | `courier.md`, `foundation-courier-configuration.md` |
| Project file structure / starting a new project          | `foundation-file-structure.md`                      |
| Version control / deployment                             | `cassettes.md`                                      |
| Calling the Blutui MCP or writing MCP integrations       | `mcp.md`                                            |
| Using Canopy (in-page editor)                            | `canopy.md`                                         |

Rule files live at: `rules/<rule-name>.md`

**Always load ALL rules that apply.** Multiple rules often overlap for a single task — for example, adding a contact form in a template requires `forms.md` + `foundation-templates-and-layouts.md`

---

## Core Principles (Apply to Every Task)

These apply regardless of which specific rules you load:

### 1. Understand the templates → layouts relationship

Blutui project have two distinct layers — **templates** and **layouts** — and it's important not to confuse them:

- **`templates/`** — The base Canvas files that define the full HTML shell of the page. Then define the `{% block %}` regions that layouts fill in. Think of these like the root layout files — developers own them, editors never touch them.
- **`layouts/`** — Built on top of templates by extending them. Layouts define the visual structure of a page as a content editor would think about it — e.g. a full-width page, a page with a sidebar, a landing page with no navigation. **In the project dashboard, editors select a layout when creating or editing a page**, so every layout a developer creates becomes an option available to editors.

The mental model: **templates are for developers** (HTML shell, global regions), **layouts are for editors** (page shape, content zones).

### 2. Use Canvas for all templating logic

Blutui uses Canvas as its templating language. Use Canvas filters, functions, and tags. See the **Templating** category in the **Rule Index** for more information.

### 3. Collection are the data layer

Store structured content (team members, products, etc.) in **Collections**, not hardcoded in templates. Query collections via the `cms.collection('<handle>')` function or using Blutui MCP.

### 4. Forms must use Blutui's form helpers

Never build raw HTML forms for data submission. Use Blutui's built-in form tags. See `rules/forms.md` for the full pattern.

### 5. Follow the established file structure

Don't invent new top-level directories. See `rules/foundation-file-structure.md` for the canonical layout of a Blutui project.

---

## Rule Index

All rules are grouped by category:

### Foundation (CRITICAL — affects all projects)

- `rules/foundation-file-structure.md` — Directory layout, naming conventions
- `rules/foundation-templates-and-layouts.md` — Template/layout inheritance, blocks
- `rules/foundation-courier-configuration.md` — Courier setup and config

### Templating (CRITICAL — applies when writing any template)

- `rules/templating-canvas.md` — Canvas templating language: syntax, tags, filters, functions
- `rules/templating-including-templates.md` — `include`, `embed`, `extends` patterns

## What Each Rule File Contains

Each rule file in `rules/` includes:

- **Why it matters** — the problem it solves
- **The rule** — concise statement of what to do
- **Code examples** — correct and incorrect patterns
- **Common mistakes** — antipatterns to avoid

## Full Reference

For all rules compiled in one document: `AGENTS.md`

Use `AGENTS.md` when you need a comprehensive reference or when you're unsure which rules apply — it's faster to scan then loading files individually.
