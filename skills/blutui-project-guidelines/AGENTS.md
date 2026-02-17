# Blutui Project Guidelines

**Version 1.0.0**  
Blutui  
February 2026

---

---

## Table of Contents

0. [Section 0](#0-section-0) - **MEDIUM**
   - 0.1 [Blutui Form standards and examples](#01-blutui-form-standards-and-examples)
   - 0.2 [Blutui MCP](#02-blutui-mcp)
   - 0.3 [Canopy](#03-canopy)
   - 0.4 [Canvas - Template Engine](#04-canvas---template-engine)
   - 0.5 [Cassettes](#05-cassettes)
   - 0.6 [Collections](#06-collections)
   - 0.7 [Courier](#07-courier)
   - 0.8 [Routing Pattern Standard](#08-routing-pattern-standard)
1. [Foundation](#1-foundation) - **CRITICAL**
   - 1.1 [Configuration](#11-configuration)
   - 1.2 [File structure](#12-file-structure)
   - 1.3 [Layouts and Templates](#13-layouts-and-templates)

---

## 0. Section 0

**Impact: MEDIUM**

### 0.1 Blutui Form standards and examples

**Impact: MEDIUM**

Ensure your `views` directory is organized as follows:

- `views/`

  - `components/`

    - `form.html` (Macro definitions)

  - `forms/`

    - `contact.html` (Form implementation)

- **Allowed Types:** "text", "textarea", "radio", "select", "checkbox", "url", "email", "phone", "hidden", "time", "date", "number"

- Do not attempt to use custom field types. If a type is not on this list, default to `text` and notify the user.

- Always transmit field types to the MCP in lowercase format.

Reference: [Link to documentation](https://dev.blutui.com/guides/create-form)

### 0.2 Blutui MCP

**Impact: MEDIUM**

- The `list_*` tools (such as `list_pages`, `list_forms`, etc.) can be used to list all the different resources available within the project.

- The `retrieve_*` tools (such as `retrieve_page`, `retrieve_forms`, etc.) can be used to retrieve a single resources within the project.

- The `create_*` tools (such as `create_page`, `create_form`, etc.) can be used to create new resources within the project.

When creating a new page, the agent must follow this exact sequence:

1. **Create the layout file** in `views/layouts/` (e.g., `views/layouts/about.html`). The layout should extend a template and include components.

2. **Run `list_pages`** to check for existing pages and avoid duplicates.

3. **Use the `create_page` MCP tool** to register the page in the Blutui dashboard, setting the layout path relative to `views/` (e.g., `layouts/about.html`).

The agent must never skip the MCP step. A layout file without a corresponding page in the dashboard will not be accessible on the site.

- Blutui Courier MCP comes with a powerful `search_blutui_documentation` tool you should use before any other approaches.

- You must use this tool to search the Blutui documentation before falling back to other approaches.

- Search the documentation before making code changes to ensure we are taking the correct approach.

- **Pre-flight Check:** For the `create_page`, `create_form` or `create_menu` tool, always execute the corresponding `list_*` tool first.

- **Validation:** Compare the user's desired `handle` against the `handle` properties in the retrieved list.

- **Error Prevention:** If a match is found, do not call the creation tool. Instead, notify the user of the conflict.

- **Offline Mode:** If the `blutui` MCP tools are unreachable, you must ask the user for the specific `handle` property in the before suggesting a configuration.

Reference: 

- [Link to documentation - Connect to Blutui MCP](https://docs.blutui.com/docs/getting-started/agentic-development)

- [Link to documentation - Connect to Figma MCP](https://dev.blutui.com/guides/figma-to-blutui)

### 0.3 Canopy

**Impact: MEDIUM**

Canopy is Blutui's in-page editor that enables developers to construct the website's structure and allow content managers to edit pages directly within the interface.

Canopy functions enable a developer to add editing capabilities for a variety of elements in a project. For example editing text, lists, images, videos, buttons, audios and headings.

Use the search_blutui_documentation mcp tool to access the canopy functions that can be used in a project.

Reference: [Link to documentation](https://docs.blutui.com/docs/canopy/getting-started)

### 0.4 Canvas - Template Engine

**Impact: MEDIUM**

Canvas serves as the template engine for Blutui, combining HTML, CSS, and JavaScript with unique Canvas logic to create fully customized project designs.

- The template is a regular text file. It can generate any text-based format (HTML, XML, CSV, LaTeX, etc.). The file extension is ".canvas".

- A template contains variables, tags, filters, functions, tests, expressions and other templating festures, which get replaced with values when the template is evaluated, and tags, which control the template's logic.

**Example** 

- There are two kinds of delimiters: 

    - {% ... %}: Used for executing statements.

    - {{ ... }} : Used for printing values to the rendered page.

The `include` function is useful to include a template and return the rendered content of that template into the current one.

Included templates automatically inherit the data context of their parent. This ensures that any variables defined in your main template are immediately accessible within the included file without extra configuration.

Templates in subdirectories can be accessed with a slash:

Use `include` to pull reusable components from the `views/components/` directory into layouts:

Blocks are used for inheritance and act as placeholders and replacements at the same time.

A block provides a way to change how a certain part of a template is rendered but it does not interfere in any way with the logic around it.

Canvas allows to add the name of the block after the end tag for better readability.

**Example:** Incorrect way to use blocks

**Example:** Correct way to use blocks 

A child template looks like this

A parent template looks like this

**Example:** a block included within an if statement

Maximize your workflow with template inheritance. Instead of duplicating code, build a single base template for common site features in `views/templates/defualt.html`.  Use `blocks` to define areas where child templates can inject specific content, ensuring a consistent structure across every page.

**Example**: Define a base.html template for a two-column page.

In this example, the block tags define four blocks that child templates can fill in. All the block tag does is to tell the template engine that a child template may override those portions of the template.

A child template might look like this:

The `extends` tag can be used to extend a template from another one. Canvas does not support multiple inheritance.

- Use the search_blutui_documentation tool in Blutui MCP to find more information on available tags, filters, functions, tests, expressions and other templating festures.

Always follow the 3-tier pattern when building pages:

1. **Template** (`templates/default.html`) — Defines the overall HTML structure with `block` placeholders.

2. **Layout** (`layouts/about.html`) — Extends the template using `{% extends %}`, fills `block` content, and includes components.

3. **Component** (`components/hero.html`) — A reusable UI fragment included via `{{ include() }}`.

**Example:** Complete 3-tier composition

Template (`views/templates/default.html`):

Component (`views/components/hero.html`):

Layout (`views/layouts/about.html`):

Reference: [Link to documentation](https://dev.blutui.com/guides/what-is-blutui-canvas)

### 0.5 Cassettes

**Impact: MEDIUM**

Blutui Cassettes function as a version control system for your front-end logic, allowing you to manage and toggle between various website designs within a single project. 

Each project can have multiple cassettes. 

To switch cassettes, update the cassette property within the `courier.json` file. If this property is missing or undefined, prompt the user to provide the specific cassette handle.

Reference: [Link to documentation](https://dev.blutui.com/docs/cassettes/getting-started)

### 0.6 Collections

**Impact: MEDIUM**

Collections are the primary method for managing structured data within Blutui that define reusable data schemas using a wide range of field types. 

- Unique handles are mandatory for all collections. The agent must validate handle availability before initiating the creation process.

- The available field types are: "text", "textarea", "richtext", "checkbox", "radio", "select", "email", "phone", "url", "date", "time", "date-time", "color", "file", "number" 

- Do not add custom field types.

Collections are designed for structured data modeling. Implement a Collection whenever you need to store multiple entries that share a consistent architecture (e.g., matching keys or data types) to ensure efficient querying and rendering.

In the case, when a collection has a some connection to another collection, the agent can look into linking collections using the search_blutui_documentation mcp tool.

To create, retreive and list collection or collection entries or links, the agent must utilize the tools present in Blutui MCP. 

Reference: [Link to documentation](https://dev.blutui.com/docs/collections/getting-started)

### 0.7 Courier

**Impact: MEDIUM**

Courier is a command-line interface tool to interact with a project. It allows user's to easily push code to their project and pull code down to their machine.

- Courier includes the Blutui MCP server that comes with powerful tools designed specifically for this project.

Courier must be installed and configured on the user's machine to enable full functionality. `courier version` command can be used to check if the user has courier installed.

Reference: [Link to documentation](https://dev.blutui.com/docs/courier/getting-started)

### 0.8 Routing Pattern Standard

**Impact: MEDIUM**

The agent must pay attention to route patterns when the project would require to build many pages that will include more than one nested page.

- A route pattern could include parameter(s) (e.g., `/team/:name`), which is accessed in code via `route.data.name`.

- The supported parameter types: string, slug, date, time, number.

- Each unique route pattern is mapped to a single template file.

Route patterns can be utilised to filter collections as shown below:

Use Blutui MCP tools to create, retreive and list route patterns.

When using the create_route-pattern tool, the agent must use the list_route-patterns tool and determine a unique route pattern.

Reference: [Link to documentation - How do I use route patterns in my project?](https://docs.blutui.com/guides/add-route-patterns)

---

## 1. Foundation

**Impact: CRITICAL**

### 1.1 Configuration

**Impact: CRITICAL**

The handle is a required property in the `courier.json` file located in the root directory of the project. It specifies the unique identifier for the Blutui project. The agent must always prompt the user to provide the `handle` property. The agent must not attempt to guess or fabricate a handle. A missing handle could be one of the reasons for failure of Blutui mcp tool calls.

The cassette specified in the `courier.json` file determines which version of the project is active.

**Prior to making any changes to the `courier.json` file, the agent must confirm if the user has logged in using

the command below and add the token.txt file to the root directory of the project. If the user has not done this, the agent must instruct the user to complete this step first.**

**After making any changes to the `courier.json` file, the agent must instruct the user to restart the Blutui MCP server.**

Reference: [Link to documentation](https://dev.blutui.com/docs/courier/configuration)

### 1.2 File structure

**Impact: MEDIUM**

Store assets including compiled JS/CSS, images and static PDFs.

This folder is the primary environment for UI development. Follow these sub-directory conventions:

* "templates/": Has files with reusable design bases and system views.

   * "default.html": The foundational template for a Blutui project. This file forms the outermost structure of a Blutui project. It features essential sections like the head, where style definitions reside, and the body, where content gets placed. The most efficient way to build upon this file is by using inheritance, capitalising on the block tag.

   * "404.html": A template for handling "Page Not Found" errors.

* "layouts/": The layouts folder is the **only** way to create pages in a project. Each layout file maps to a page registered via the Blutui dashboard or MCP tools. **Do not create a `pages/` directory.** All page content belongs in layout files.

* "components/": Contains atomic, reusable UI fragments. Always create components for repeated UI elements (headers, footers, hero sections, CTAs, cards, etc.) and include them in layouts using `{{ include('components/filename.html') }}`.

Develop the project using a **component-first approach**. Always break the UI into reusable components in `views/components/`. Include components in layouts using `{{ include() }}` and use `{% block %}` tags for template inheritance. This minimizes duplicate work and ensures design updates stay consistent across all project views.

Hierarchy:

* Parent: templates/default.html (Defines the overall structure).

* Child: layouts/index.html (Extends the template and provides specific page content).

To implement this, ensure the child layout file begins with the `{% extends 'templates/default.html' %}` declaration. Map your content to the parent's placeholders by wrapping your HTML in matching `block` names. Include reusable components within those blocks.

Before generating any HTML or component code, the agent must detect the project's existing style system:

1. Check for `tailwind.config.*` or `postcss.config.*` files in the project root.

2. Check for CSS framework CDN links (e.g., Bootstrap, Bulma) in `views/templates/default.html`.

3. Check for CSS files in the `/public` directory.

- If a style system is found (e.g., TailwindCSS), **always use its utility classes and conventions** in all generated HTML and components.

- If no style system is detected, **ask the user** which style approach they want before generating any HTML.

- Never generate unstyled or bare HTML when a style system is available in the project.

Reference: [Link to documentation](https://docs.blutui.com/docs/getting-started/folder-structure)

### 1.3 Layouts and Templates

**Impact: MEDIUM**

- A template defines the overall structure of the project, including common elements like headers, footers, and navigation menus used to provide a consistent look and feel across multiple pages in a project.

- A template can be extended by another template file but not a layout.

- Layouts are the **only** way to create pages in Blutui. Each layout file in `views/layouts/` corresponds to a page created via the Blutui dashboard or MCP tools.

- **Never create files in a `pages/` directory.** The `pages/` directory must be ignored entirely. All page content lives in layout files.

- When using the `layout`, `template`, `post_layout` or `blog_layout` parameters in any Blutui MCP tool, make sure the layout file path is relative to the `views` directory (e.g., `layouts/about.html`, not `views/layouts/about.html`).

- Always place layout files in the `views/layouts` directory.

Follow these steps every time a new page is needed:

1. **Check for the layouts folder:** If `views/layouts/` does not exist, create it. If it already exists, proceed.

2. **Create the layout file:** Create a new `.html` file inside `views/layouts/` (e.g., `views/layouts/about.html`).

3. **Extend a template:** The layout must extend a template using `{% extends 'templates/default.html' %}`.

4. **Build with components:** Create reusable UI fragments in `views/components/` and include them in the layout using `{{ include('components/hero.html') }}`.

5. **Register the page via MCP:** Use the Blutui MCP `create_page` tool to create the page in the dashboard, setting the layout path relative to `views/` (e.g., `layouts/about.html`).

**Example:** A layout file at `views/layouts/about.html`

Reference: [Link to documentation - How to create a Layout](https://docs.blutui.com/guides/create-layout)

---

