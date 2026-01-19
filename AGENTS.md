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

- The template is a regular text file. It can generate any text-based format (HTML, XML, CSV, LaTeX, etc.). The file extension is ".canvas"
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

- Use the search_blutui_documentation tool in Blutui MCP to find more information on available tags, filters, functions, tests, expressions and other templating festures.

## Courier

Courier is a command-line interface tool to interact with a project. It allows user's to easily push code to their project and pull code down to their machine.

- Courier includes the Blutui MCP server that comes with powerful tools designed specifically for this project.

Courier must be installed and configured on the user's machine to enable full functionality. `courier version` command can be used to check if the user has courier installed.

## Blutui Cassettes & Courier Workflow

Cassettes provide version control for a project. Each project can have multiple Cassettes, allowing for rapid design switching or parallel development. 

## Collections

Collections are the primary method for managing structured data within Blutui that define reusable data schemas using a wide range of field types. 

- Each collection must have a unique handle. The agent must check if the a handle exists, prior to creating a new collection.
- The available field types are: "text", "textarea", "richtext", "checkbox", "radio", "select", "email", "phone", "url", "date", "time", "date-time", "color", "file", "number" 
- Do not add custom field types.

Use a Collection whenever you need to add data that share the same structure. 

In the case, when a collection has a some connection to another collection, the agent can look into linking collections using the search_blutui_documentation mcp tool.

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

## Routing Pattern Standard

The agent must pay attention to route patterns when the project would require to build many pages that will include more than one nested page.

- A route pattern could include parameter(s) (e.g., `/team/:name`), which is accessed in code via `route.data.name`.
- The supported parameter types: string, slug, date, time, number.
- Each unique route pattern is mapped to a single template file.

Route patterns can be utilised to filter collections as shown below:

```canvas
{% set members = cms.collection('team') %}
{% set member = members | filter(entry => (entry.name | slug) == route.data.name) | first %}
<h1>{{ member.name }}</h1>
<p>{{ member.bio }}</p>
```

Use Blutui MCP tools to create, retreive and list route patterns.

When using the create_route-pattern tool, the agent must use the list_route-patterns tool and determine a unique route pattern.

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












