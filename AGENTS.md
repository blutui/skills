# Blutui Project Guidelines

The Blutui Project guidelines are specifically curated by Blutui maintainers for this project. These guidelines should be followed closely to enhance the user's satisfaction in building a Blutui project.

## File structure

### "/public" directory

Store assets including complied JS/CSS, images and static PDFs.

### "/views" directory

This folder is the primary environment for UI development. Follow these sub-directory conventions:

* "pages/": Each file in this directory corresponds to a specific URI or site section (e.g., "about-us.html") with unique page content or layout-specific overrides. Each file path maps to a URL route. To include a directory in the route path, create an index.html file within that directory. Other page files can be named as desired.
* "templates/": Has files with reusable design bases and system views. Key files include "default.html" (The foundational structure for the site.) and "404.html"  (The error state page).
* "layouts/": Each file in this directory corresponds to content that wraps around multiple pages to provide a persistent UI (e.g., headers and footers). A layout file always extends a template file.
* Custom Directories (e.g., "components/"): Custom directories added for atomic, reusable UI fragments or any other purposes.

## Blutui Canvas 

**Canvas** is the template engine for Blutui that allows to build custom looks and feels for projects using a mix of HTML, CSS, JavaScript, and Canvas logic.

- The template is a regular text file. It can generate any text-based format (HTML, XML, CSV, LaTeX, etc.).
- A template contains variables or expressions, which get replaced with values when the template is evaluated, and tags, which control the template's logic.

**Example** 

```canvas
<!DOCTYPE html>
<html>
  <head>
    <title>My Webpage</title>
  </head>

  <body>
    <ul id="navigation">
      {% for item in navigation>
        <li><a href="{{ item.href }}">{{ item.caption }}</a></li>
      {% endfor %}
    </ul>

    <h1>My Webpage</h1>
    {{ a_variable }}
  </body>
</html>
```

- There are two kinds of delimiters: 
    - {% ...> : Used for executing statements.
    - {{ ... }} : Used for printing values to the rendered page.

- Use the search_docs tool in Blutui MCP to find more information on available tags, filters, functions, tests, expressions and other templating festures.

## Courier

Courier is a command-line interface tool to interact with a project. It allows user's to easily push code to their project and pull code down to their machine.

- Courier includes the Blutui MCP server that comes with powerful tools designed specifically for this project.

Courier must be installed and configured on the user's machine to enable full functionality. `courier version` can be used to check if the user has courier installed.

## Blutui Cassettes & Courier Workflow

Cassettes provide version control for a project. Each project can have multiple Cassettes, allowing for rapid design switching or parallel development. 

## Collections

Use a Collection whenever you need to manage multiple items that share the same structure. Instead of building a new page for every individual entry, use a Collection to create a single template that powers them all.

- A collection is equivalent to a table with pre-defined fields.
- Each collection has a unique handle and a name. The agent must check if the a handle exists, prior to creating a new collection.
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

### Available MCP tools

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

## Configuration (`courier.json`)

The handle is a required property in the `courier.json` file located in the root directory of the project. It specifies the unique identifier for the Blutui project. The agent must always prompt the user to provide the `handle` property. The agent must not attempt to guess or fabricate a handle. A missing handle could be one of the reasons for failure of Blutui mcp tool calls.

The cassette specified in the `courier.json` file determines which version of the project is active. 

**Prior to making any changes to the `courier.json` file, the agent must confirm if the user has logged in using 

```bash 
courier login --token < token.txt
``` 
command and added the token.txt file to the root directory of the project. If the user has not done this, the agent must instruct the user to complete this step first.**

```json
{
  "cassette": "default",
  "handle": "project-handle"
}
```

**After making any changes to the `courier.json` file, the agent must instruct the user to restart the Blutui MCP server.** 

## Routing Pattern Standard

### Key Concepts to Convey

- Dynamic URLs (e.g., `/team/{name}`) that map to a single template layout.
- The variable part of the URL (e.g., `{name}`), which is accessed in code via `route.data.name`.
- To filter logic use Canvas to match URL slugs against collection data to pull the correct record.
- Standardize to lowercase-hyphenated-format (e.g., `/product-category/{slug}`).
- Use `{type}` notation. Supported types: {string}, {slug}, {date}, {time}, {number}.
- Check for existing route conflicts; do not create duplicate patterns.
- The agent must first create a layout file (e.g., `team-member.html`).
- This file serves as the template for every item in the collection.
- For directory-based routes, create an `index.html` file within the directory to define the page at that path (e.g., `pages/about/index.html` maps to `/about`).

```canvas
{% set members = cms.collection('team') %}
{% set member = members | filter(entry => (entry.name | slug) == route.data.name) | first %}
<h1>{{ member.name }}</h1>
<p>{{ member.bio }}</p>
```

## Forms

### Directory Structure

Ensure your `views` directory is organized as follows:
- `views/`
  - `components/`
    - `form.html` (Macro definitions)
  - `forms/`
    - `contact.html` (Form implementation)

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

#### Usage Example (in `views/forms/contact.html`):

```canvas
{% import 'components/form' as ui %}

{% form 'contact' %}
  {% for field in form.fields %}
    {{ ui.field(field) }}
  {% endfor %}

  <button type="submit" class="">Submit</button>
{% endform %}
```

### Form Field Constraints

- **Allowed Types:** "text", "textarea", "radio", "select", "checkbox", "url", "email", "phone", "hidden", "time", "date", "number"
- Do not attempt to use custom field types. If a type is not on this list, default to `text` and notify the user.
- Always transmit field types to the MCP in lowercase format.












