<blutui-project-guidelines>

# Blutui Project Guidelines

The Blutui Project guidelines are specifically curated by Blutui maintainers for this project. These guidelines should be followed closely to enhance the user's satisfaction building a Blutui project.

## Foundational Context

When working with a Blutui it is important that the `courier.json` configuration file is present in order to push/pull code changes, and interacting with Blutui Context.

## Skill Activation

This project has domain-specific skills available. You MUST activate the relevant skill whenever you work in that domain — don't wait until you're stuck.

- `assembling-pages` — Activates when the user mentions pages, routes, blogs, or navigation structure.
- `developing-with-collections` — Activates when the user mentions data schemas, content types, Collections, or Collection entries.
- `developing-forms` — Activates when the user mentions forms, form fields, or form submissions.
- `mastering-canvas` — Architects high-quality Blutui Canvas templates by applying core development best practices. Activates when the user mentions templates, Canvas, Canvas tags, Canvas filters, Canvas functions, or components.

## Replies

- Be concise in your explanations - focus on what's important rather than explaining obvious details.

## Blutui Context

- Blutui Context is an MCP server that comes with powerful tools designed specifically for this project. Use them.
- Use `list_*` tools before `create_*` to avoid duplicate content.

## Search Documentation (Critically Important)

- Blutui Context comes with a powerful `search_blutui_documentation` tool you should use before trying other approaches when working with a Blutui project.
- Search the documentation before making code changes to ensure we are taking the correct approach.

## Project Folder Structure

Don't invent new top-level directories. Create the appropriate files within the following top-level directories:

- `./public` — This folder houses the compiled, production-ready version of your JavaScript and CSS code. It can also contain assets like images, PDFs, and other static files.
- `./views` — This is where the core of the project's front-end logic resides. All the development work, components, templates, and layouts will be within this folder.

## Templating

Canvas serves as the template engine for Blutui projects, combining HTML with unique Canvas syntax to create fully customized project designs. Use `search_blutui_documentation` for detailed documentation on Blutui Canvas.

- The template is a regular text file. The available file extensions are ".canvas" and ".html" based on file extension that used in the project.
- A template contains variables, tags, filters, functions, tests, expressions and other templating features, which get replaced with values when the template is evaluated.

## Templates & Layouts

Blutui project's have two distinct layers for creating pages — **templates** and **layouts** — and it's important not to confuse them:

- `./views/templates/` — The base Canvas files that define the full HTML shell of a page. They define the `{% block %}` regions that layouts fill in. Think of these like the root layout files — developers own them, editors never touch them.
- `./views/layouts/` — Built on top of templates by extending them. Layouts define the visual structure of a page as a content editor would think about it — eg. a full-width page, a page with a sidebar, a landing page with no navigation. **In the project dashboard, editors select a layout when creating or editing a page**, so every layout a developer creates becomes an option available to editors.

IMPORTANT: Activate `assembling-pages` everytime you're working with pages, blogs and blog posts, and route patterns.

</blutui-project-guidelines>
