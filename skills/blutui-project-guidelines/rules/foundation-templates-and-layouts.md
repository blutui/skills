| Title | Impact | Impact Description | Tags |
|-------|--------|-------------------|------|
| Templates and Layouts | CRITICAL | Functional Impact - Blutui templates and layouts govern core project logic. Deviating from these structures results in broken inheritance and rendering failures, preventing the project from functioning as intended. | project, file structure, views, templates, layouts, components |

## Layouts and Templates

### Templates

- A template defines the overall structure of the project, including common elements like headers, footers, and navigation menus used to provide a consistent look and feel across multiple pages in a project.
- A template can be extended by another template file but not a layout.

### Layouts

- Layouts are the **only** way to create pages in Blutui. Each layout file in `views/layouts/` corresponds to a page created via the Blutui dashboard or MCP tools.
- **Never create files in a `pages/` directory.** The `pages/` directory must be ignored entirely. All page content lives in layout files.
- When using the `layout`, `template`, `post_layout` or `blog_layout` parameters in any Blutui MCP tool, make sure the layout file path is relative to the `views` directory (e.g., `layouts/about.html`, not `views/layouts/about.html`).
- Always place layout files in the `views/layouts` directory.

### Page Creation Workflow

Follow these steps every time a new page is needed:

1. **Check for the layouts folder:** If `views/layouts/` does not exist, create it. If it already exists, proceed.
2. **Create the layout file:** Create a new `.html` file inside `views/layouts/` (e.g., `views/layouts/about.html`).
3. **Extend a template:** The layout must extend a template using `{% extends 'templates/default.html' %}`.
4. **Build with components:** Create reusable UI fragments in `views/components/` and include them in the layout using `{{ include('components/hero.html') }}`.
5. **Register the page via MCP:** Use the Blutui MCP `create_page` tool to create the page in the dashboard, setting the layout path relative to `views/` (e.g., `layouts/about.html`).

**Example:** A layout file at `views/layouts/about.html`

```canvas
{% extends 'templates/default.html' %}

{% block content %}
  {{ include('components/hero.html') }}

  <section>
    <h1>About Us</h1>
    <p>Welcome to our about page.</p>
  </section>

  {{ include('components/cta.html') }}
{% endblock %}
```

Reference: [Link to documentation - How to create a Layout](https://docs.blutui.com/guides/create-layout)
