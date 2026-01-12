# Blutui Project Guidelines

The Blutui Project guidelines are specifically curated by Blutui maintainers for this project. These guidelines should be followed closely to enhance the user's satisfaction in building a Blutui project.

## File structure

### "/public" directory

Store assets including complied JS/CSS, images and static PDFs.

### "/views" directory

This folder is the primary environment for UI development. Follow these sub-directory conventions:

* "pages/": Each file in this directory corresponds to a specific URI or site section (e.g., "about-us.html") with unique page content or layout-specific overrides.
* "layouts/": Each file in this directory corresponds to cpntent that wraps around multiple pages to provide a persistent UI (e.g., headers and footers).
* "templates/": Has files with reusable design bases and system views. Key files include "default.html" (The foundational structure for the site.) and "404.html"  (The error state page).
* Custom Directories (e.g., "components/"): Custom directories added for atomic, reusable UI fragments or any other purposes.

## Styling

Always use **Tailwind CSS** for styling unless a specific alternative styling package is explicitly installed in "package.json".

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

### Templating

Example: Control Structure

```canvas
{% if users | length > 0 %}
  <ul>
    {% for user in users %}
      <li>{{ user.username | e }}</li>
    {% endfor %}
  </ul>
{% endif %}
```

- To comment-out part of a line in a template, use the comment syntax {# ... #}.
- Use the include function is useful to include a template and return the rendered content of that template into the current one: `{{ include('sidebar.html') }}`

#### Template Inheritence

Enales to build a base "skeleton" template that contains all the elements of the poject and defines blocks that child templates can override with the use of extends tag to extend another template.

Example: 

base template

```canvas
<!DOCTYPE html>
<html>
  <head>
    {% block head %}
      <link rel="stylesheet" href="style.css" />
      <title>{% block title %}{% endblock %} - My Webpage</title>
    {% endblock %}
  </head>

  <body>
    <div id="content">{% block content %}{% endblock %}</div>
    <div id="footer">
      {% block footer %}
        &copy; Copyright 2011 by <a href="http://domain.invalid/">you</a>.
      {% endblock %}
    </div>
  </body>
</html>
```

child template

```canvas
{% extends 'base.html' %}

{% block title %}Index{% endblock %}

{% block head %}
  {{ parent() }}
  <style type="text/css">
    .important { color: #336699; }
  </style>
{% endblock %}

{% block content %}
  <h1>Index</h1>
  <p class="important">
    Welcome to my awesome homepage.
  </p>
{% endblock %}
```

#### HTML Escaping

1 The automatic escaping strategy can be configured via the autoescape tag and defaults to html.
2 For larger sections, use verbatim tag to mark a block.

#### Macros

- Macros are comparable with functions in regular programming languages. 
- They are useful to reuse HTML fragments to avoid repeating.
- Discover other available macros in tag documentation utilising the search_docs mcp tool.

#### Whitespace control

1 Whitespace trimming via the - modifier: Removes all whitespace (including newlines);
2 Line whitespace trimming via the ~ modifier: Removes all whitespace (excluding newlines). Using this modifier on the right disables the default removal of the first newline inherited.
3 The modifiers can be used on either side of the tags like in {%- or -%} and they consume all whitespace for that side of the tag. It is possible to use the modifiers on one side of a tag or on both sides.
4 The spaceless tag filter that removes whitespace between HTML tags

Example 

```canvas
{% set value = 'no spaces' %}
{#- No leading/trailing whitespace -#}
{%- if true -%}
  {{- value -}}
{%- endif -%}
{# output 'no spaces' #}

<li>
  {{ value }}    </li>
{# outputs '<li>\\n    no spaces    </li>' #}

<li>
  {{- value }}    </li>
{# outputs '<li>no spaces    </li>' #}

<li>
  {{~ value }}    </li>
{# outputs '<li>\\nno spaces    </li>' #}

{% apply spaceless %}
  <div>
    <strong>foo bar</strong>
  </div>
{% endapply %}

{# output will be <div><strong>foo bar</strong></div> #}
```

### Expressions

The operator precedence is as follows, with the lowest-precedence operators listed first: ?: (ternary operator), b-and, b-xor, b-or, or, and, ==, !=, <=>, <, >, >=, <=, in, matches, starts with, ends with, .., +, -, ~, *, /, //, %, is (tests), **, ??, | (filters), [], and .

```canvas
{% set greeting = 'Hello ' %}
{% set name = 'Fabien' %}

{{ greeting ~ name | lower }} {# Hello fabien #}

{# use parenthesis to change precedence #}
{{ (greeting ~ name) | lower }} {# hello fabien #}
```

### Variables

Example: How to pass variables

```canvas
{{ foo.bar }}
```

Example: To access a dynamic atrribute of a variable

```canvas
{# equivalent to the non-working foo.data-foo #}
{{ attribute(foo, 'data-foo') }}
```

Example: To assign values to variables, use set tag.

```canvas
{% set foo = 'foo' %}
{% set foo = [1, 2] #}
{% set foo = {'foo': 'bar'} #}
```

### Filters

- Variables can be modified by filters (|). 
- Multiple filters can be chained. 
- The output of one filter is applied to the next.
- Can accept arguments have parentheses around the arguments.

Examples

```canvas
{{ name | striptags | title }}
{{ list | join(', ') }}
```

To apply a filter on a section of code, wrap it with the apply tag:

```canvas
{% apply upper %}
  This text becomes uppercase
{% endapply %}
```

### Functions

Example: For instance, the range function returns a list containing an arithmetic progression of integers:

```canvas
{% for i in range(0, 3) %}
  {{ i }},
{% endfor %}
```

or 

```canvas
{% for i in range(low = 1, high = 10, step = 2) %}
  {{ i }},
{% endfor %}
``` 

- Use the search_docs tool in Blutui MCP to find more information on available tags, filters, functions, tests, expressions and other templating festures.

## Courier

Courier is a command-line interface tool to interact with a project. It allows user's to easily push code to their project and pull code down to their machine.

- Courier includes the Blutui MCP server that comes with powerful tools designed specifically for this project.

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

## Collections

- A collection is equivalent to a table with pre-defined fields.
- Each collection has a unique handle and a name. The agent must check if the a hadle exists, prior to creating a new collection.
- The available field types are: "text", "textarea", "richtext", "checkbox", "radio", "select", "email", "phone", "url", "date", "time", "date-time", "color", "file", "number" 
- Do not add custom field types.
- A collection entry must be created to add data to a collection.
- Create a link to connect two collections to avoid duplicate data.
- Use a Collection whenever you need to manage multiple items that share the same structure. Instead of building a new page for every individual entry, use a Collection to create a single template that powers them all.

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

## Bllutui MCP

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

## Routing Pattern Standard

- Standardize to lowercase-hyphenated-format (e.g., `/product-category/{slug}`).
- Use `{type}` notation. Supported types: {string}, {slug}, {date}, {time}, {number}.
- Check for existing route conflicts; do not create duplicate patterns.

## Form & Macro Guide

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

### Form Field Constraints

- **Allowed Types:** ["text", "textarea", "radio", "select", "checkbox", "url", "email", "phone", "hidden", "time", "date", "number"]
- Do not attempt to use custom field types. If a type is not on this list, default to `text` and notify the user.
- Always transmit field types to the MCP in lowercase format.







