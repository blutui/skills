# Blutui Project Guidelines

The Blutui Project guidelines are specifically curated by Blutui maintainers for this project. These guidelines should be followed closely to enhance the user's satisfaction in building a Blutui project.

* Version: 1.0.0
* Organization: Blutui
* Date: January 2026
* References:
  - https://dev.blutui.com



---
title: Configuration
impact: CRITICAL
impactDescription: This configuration file is the core dependency for all Courier operations, Blutui MCP connectivity, and Cassette management. Loss or corruption will halt development workflows and severely degrade system performance. 
tags: config, handle, cassette, courier.json, login, mcp
---

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

Reference: [Link to documentation](https://dev.blutui.com/docs/courier/configuration)
---
title: File Structure
impact: CRITICAL
impactDescription: Structural Integrity - Adherence to the Blutui file structure is mandatory. Deviating from these conventions breaks core system compatibility, rendering the project non-functional and preventing deployment.
tags: project, file structure, public, views, assets, pages, layouts, templates, components
---

## File structure

### "/public" directory

Store assets including complied JS/CSS, images and static PDFs.

### "/views" directory

This folder is the primary environment for UI development. Follow these sub-directory conventions:

* "pages/": Each file in this directory corresponds to a specific URI or site section (e.g., "about-us.html") with unique page content or layout-specific overrides. Each file path maps to a URL route. To include a directory in the route path, create an index.html file within that directory. Other page files can be named as desired.
* "templates/": Has files with reusable design bases and system views. Key files include "default.html" (The foundational structure for the site.) and "404.html"  (The error state page).
* "layouts/": Each file in this directory corresponds to content that wraps around multiple pages to provide a persistent UI (e.g., headers and footers). A layout file always extends a template file.
* Custom Directories (e.g., "components/"): Custom directories added for atomic, reusable UI fragments or any other purposes.

Reference: [Link to documentation](https://docs.blutui.com/docs/getting-started/folder-structure)
---
title: Form Standards 
impact: CRITICAL
impactDescription: Strict adherence to Blutui Form Syntax is mandatory. Non-compliant syntax causes silent failures or data submission errors, preventing the form from processing correctly within the ecosystem.
tags: form
---

## Blutui Form standards and examples

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

Reference: [Link to documentation](https://dev.blutui.com/guides/create-form)













---
title: Routing Pattern Standards 
impact: CRITICAL
impactDescription: Strict adherence to Blutui Route Pattern standards is mandatory. Non-compliant routing triggers 500 Server Errors and breaks site navigation, leading to total loss of user access.
tags: route, route pattern
---

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

Reference: [Link to documentation](https://docs.blutui.com/guides/add-route-patterns)
---
title: Templates and Layouts
impact: CRITICAL
impactDescription: Functional Impact - Blutui templates and layouts govern core project logic. Deviating from these structures results in broken inheritance and rendering failures, preventing the project from functioning as intended.
tags: project, file structure, views, templates, pages, layouts
---

## Layouts and Templates

### Templates

- A template defines the overall structure of the project, including common elements like headers, footers, and navigation menus used to provide a consistent look and feel across multiple pages in a project. 
- A template can be extended by another template file but not a layout.

### Layouts

- A layout defines the specific arrangement of content within a page. 
- Used to define how the content of a page must be presented within the overall structure defined by the template.
- When using the `layout`, `template`, `post_layout` or `blog_layout` parameters in any Blutui MCP tool, make sure the layout file path is relative to the `views` directory (e.g., `layouts/about.html`, not `views/layouts/about.html`). 
- Always place layout files in the `views/layouts` directory.

Reference: [Link to documentation - How to create a Layout](https://docs.blutui.com/guides/create-layout) 
---
title: MCP
impact: HIGH
impactDescription: Efficiency Multiplier - The Blutui MCP grants agents direct access to project-specific tooling, streamlining complex workflows and increasing development velocity by up to 300%.
tags: mcp, tools, search, documentation
---

## Blutui MCP

### Available MCP tools

- The `list_*` tools (such as `list_pages`, `list_forms`, etc.) can be used to list all the different resources available within the project.
- The `retrieve_*` tools (such as `retrieve_page`, `retrieve_forms`, etc.) can be used to retrieve a single resources within the project.
- The `create_*` tools (such as `create_page`, `create_form`, etc.) can be used to create new resources within the project.

### Search Documentation (Critically Important)

- Blutui Courier MCP comes with a powerful `search_blutui_documentation` tool you should use before any other approaches.
- You must use this tool to search the Blutui documentation before falling back to other approaches.
- Search the documentation before making code changes to ensure we are taking the correct approach.

### Handle Property Standards

- **Pre-flight Check:** For the `create_form` or `create_menu` tool, always execute the corresponding `list_*` tool first.
- **Validation:** Compare the user's desired `handle` against the `handle` properties in the retrieved list.
- **Error Prevention:** If a match is found, do not call the creation tool. Instead, notify the user of the conflict.
- **Offline Mode:** If the `blutui` MCP tools are unreachable, you must ask the user for the specific `handle` property in the before suggesting a configuration.

Reference: 

- [Link to documentation - Connect to Blutui MCP](https://docs.blutui.com/docs/getting-started/agentic-development)
- [Link to documentation - Connect to Figma MCP](https://dev.blutui.com/guides/figma-to-blutui)
---
title: Canvas - Template Engine
impact: CRITICAL
impactDescription: High Impact (90%) - The Template Engine serves as the critical logic layer, binding HTML elements to Blutui-specific concepts. Strict adherence to this syntax is mandatory for data interactivity; without it, the project will fail to render or process dynamic data.
tags: canvas, variables, tags, filters, functions, tests, expressions, templating festures
---

## Canvas - Template Engine

**Canvas** is the template engine for Blutui that allows to build custom looks and feels for projects using a mix of HTML, CSS, JavaScript, and Canvas logic.

- The template is a regular text file. It can generate any text-based format (HTML, XML, CSV, LaTeX, etc.). The file extension is ".canvas".
- A template contains variables, tags, filters, functions, tests, expressions and other templating festures, which get replaced with values when the template is evaluated, and tags, which control the template's logic.

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

Reference: [Link to documentation](https://dev.blutui.com/guides/what-is-blutui-canvas)
---
title: Courier
impact: CRITICAL 
impactDescription: Without Courier CLI, project updates cannot be pushed to the Blutui platform. It is essential for continuous integration, version synchronization, and maintaining a functional development lifecycle.
tags: courier, command-line interface tool
---

## Courier

Courier is a command-line interface tool to interact with a project. It allows user's to easily push code to their project and pull code down to their machine.

- Courier includes the Blutui MCP server that comes with powerful tools designed specifically for this project.

Courier must be installed and configured on the user's machine to enable full functionality. `courier version` command can be used to check if the user has courier installed.

Reference: [Link to documentation](https://dev.blutui.com/docs/courier/getting-started)
---
title: Cassettes - Project Version Control
impact: LOW
impactDescription: Version Control Impact - High. This configuration is critical only during project version transitions. Incorrect setup will block the ability to switch versions or result in environment mismatches during a migration.
tags: cassette, version control
---

## Cassettes 

Cassettes provide version control for a project. Each project can have multiple Cassettes. 

Reference: [Link to documentation](https://dev.blutui.com/docs/cassettes/getting-started)
---
title: Collections
impact: CRITICAL
impactDescription: High Impact (90%) - This section governs the binding between frontend elements and Blutui Data Collections. Failure to configure this correctly results in broken dynamic content and prevents the UI from interacting with stored project data.
tags: data, dynamic, data structure, collections
---

## Collections

Collections are the primary method for managing structured data within Blutui that define reusable data schemas using a wide range of field types. 

- Each collection must have a unique handle. The agent must check if the a handle exists, prior to creating a new collection.
- The available field types are: "text", "textarea", "richtext", "checkbox", "radio", "select", "email", "phone", "url", "date", "time", "date-time", "color", "file", "number" 
- Do not add custom field types.
- A collection entry must be created to add data to a collection.

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

Reference: [Link to documentation](https://dev.blutui.com/docs/collections/getting-started)
---
title: Canopy
impact: MEDIUM
impactDescription: Editor Integration - Critical for CMS-to-Frontend interactivity. Canopy allows developers to register components as editable assets; failure to implement correctly disables the in-page editing interface for the user.
tags: in-page editor
---

## Canopy

Canopy is Blutui's in-page editor that enables developers to construct the website's structure and allow content managers to edit pages directly within the interface.

Canopy functions enable a developer to add editing capabilities for a variety of elements in a project. For example editing text, lists, images, videos, buttons, audios and headings.

Use the search_blutui_documentation mcp tool to access the canopy functions that can be used in a project.

Reference: [Link to documentation](https://docs.blutui.com/docs/canopy/getting-started)
