# blutui-project-guidelines

 The Blutui Project guidelines are specifically curated by Blutui maintainers for this project. These guidelines should be followed closely to enhance the user's satisfaction in building a Blutui project.

## File structure

"\public": Store assets including complied JS/CSS, images and static PDFs.
"\views": Add all files related to Blutui front-end logic. This folder is the primary environment for UI development. Follow these sub-directory conventions:

* "pages/": Each file in this directory corresponds to a specific URI or site section (e.g., "about-us.html") with unique page content or layout-specific overrides.
* "layouts/": Each file in this directory corresponds to cpntent that wraps around multiple pages to provide a persistent UI (e.g., headers and footers).
* "templates/": Has files with reusable design bases and system views. Key files include "default.html" (The foundational structure for the site.) and "404.html"  (The error state page).
* Custom Directories (e.g., "components/"): custom directories added for Atomic, reusable UI fragments or anyother purposes.

## Styling

Always use **Tailwind CSS** for styling unless a specific alternative styling package is explicitly installed in "package.json".

## Blutui Canvas 

**Canvas** is the template engine for Blutui that allows to build custom looks and feels for projects using a mix of HTML, CSS, JavaScript, and Canvas logic.

- **Base Technologies:** HTML.
- **Template Logic:** Controlled via variables, expressions, and tags.

### Syntax Reference

#### Tags (Logic)

Used for executing statements.
`{% for item in collection %} ... {% endfor %}`

#### Expressions (Output)

Used for printing values to the rendered page.
`{{ variable_name }}`

## Blutui Courier

Blutui Courier is a command-line interface tool to interact with a Blutui project. It allows user's to easily push code to their Blutui project and pull code down to their machine.

- Blutui Courier includes the Blutui MCP server that comes with powerful tools designed specifically for this project.

## Blutui Cassettes & Courier Workflow

Cassettes provide version control for a project. Each project can have multiple Cassettes, allowing for rapid design switching or parallel development.

### Configuration (`courier.json`)

```json
{
  "$schema": "https://dev.blutui.com/schemas/v1/schema.json",
  "cassette": "development-v1",
  "handle": "client-project-handle"
}
```

## Blutui Collections

- A blutui collection is equivalent to a table with pre-defined fields.
- Each collection has a unique handle and a name. The agent must check if the a hadle exists, prior to creating a new collection.
- The available field types are: "text", "textarea", "richtext", "checkbox", "radio", "select", "email", "phone", "url", "date", "time", "date-time", "color", "file", "number" 
- Do not add custom field types.
- A collection entry must be created to add data to a collection.
- Create a link to connect two collections to avoid duplicate data.

To create, retreive and list collection or collection entries or links, the agent must utilize the tools present in Blutui MCP. 

### Connect collection data in a template

```canvas
{% set authors = cms.collection('authors') %}
{% set author = authors | first %}
<div class="author-section">
  <img
    src="{{ author.avatar }}"
    alt="{{ author.name }}"
  >
  <p>
    <strong>{{ author.name }}</strong>
  </p>
  <div>
    {{ author.bio | raw }}
  </div>
</div>
```

## Blutui MCP

### Available Blutui MCP tools

- The `list_*` tools (such as `list_pages`, `list_forms`, etc.) can be used to list all the different resources available within the project.
- The `retrieve_*` tools (such as `list_page`, `list_form`, etc.) can be used to retrieve a single resources within the project.
- The `create_*` tools (such as `create_page`, `create_form`, etc.) can be used to create new resources within the project.

### Search Documentation (Critically Important)

- Blutui Courier MCP comes with a powerful `search_blutui_documentation` tool you should use before any other approaches.
- You must use this tool to search the Blutui documentation before falling back to other approaches.
- Search the documentation before making code changes to ensure we are taking the correct approach.

### Handle Property Standards

- **Pre-flight Check:** For the `create_form` or `create_menu` tool, always execute the corresponding `list_*` tool first.
- **Validation:** Compare the user's desired `handle` against the `handle` properties in the retrieved list.
- **Error Prevention:** If a match is found, do not call the creation tool. Instead, notify the user of the conflict.
- **Offline Mode:** If the `blutui` MCP tools are unreachable, you must ask the user for the specific `handle` property before suggesting a configuration.

### Layout Property Standards

- All `layout`, `template`, `post_layout` or `blog_layout` parameters must reside in the `layouts/` folder in any Blutui MCP tool.
- Strictly abide by this pattern: `layouts/{filename}.(html|canvas)`
- Automatically prepend `layout/` if the user provides a raw filename.
- **Example Tool Call:**
  create_page(
    handle: "about-us",
    layout: "layouts/standard.html"
  )

## Blutui Routing Pattern Standard

- Standardize to lowercase-hyphenated-format (e.g., `/product-category/{slug}`).
- Use `{type}` notation. Supported types: {string}, {slug}, {date}, {time}, {number}.
- Check for existing route conflicts; do not create duplicate patterns.

## Blutui Form & Macro Guide

### Directory Structure

Ensure your `views` directory is organized as follows:
- `views/`
  - `components/`
    - `form.html` (Macro definitions)
  - `forms/`
    - `contact.html` (Form implementation)

### The Form Macro System

Macros allow us to define how form fields (inputs, textareas, etc.) are rendered. 

#### Usage Example (in `views/components/form.html`):

```canvas
{% macro input(data) %}
  <input type="{{ data.type }}" name="{{ data.name }}" placeholder="{{ data.placeholder }}" {% if data.required %} required {% endif %} />
{% endmacro %}

{% macro field(data) %}
  <div class="field-wrapper">
    <label>{{ data.label }}</label>
    {% if data.type == 'textarea' %}
      {{ _self.textarea(data) }}
    {% else %}
      {{ _self.input(data) }}
    {% endif %}
  </div>
{% endmacro %}
```

### Form Field Constraints

- **Allowed Types:** ["text", "textarea", "radio", "select", "checkbox", "url", "email", "phone", "hidden", "time", "date", "number"]
- Do not attempt to use custom field types. If a type is not on this list, default to `text` and notify the user.
- Always transmit field types to the MCP in lowercase format.







