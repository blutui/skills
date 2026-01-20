---
title: Templates and Layouts
impact: CRITICAL
tags: project, file structure, views, templates, pages, layouts
---

## Layouts and Templates

- A template is a file that defines the overall structure of the project, including common elements like headers, footers, and navigation menus. Templates are used to provide a consistent look and feel across multiple pages in a project. A template can be extended by another template file but not a layout file.
- A layout is a file that defines the specific arrangement of content within a page. Layouts are used to define how the content of a page must be presented within the overall structure defined by the template.
- A page is a file that extends a layout to define the specific content for that page.
- When using the `layout`, `template`, `post_layout` or `blog_layout` parameters in any Blutui MCP tool, make sure the layout file path is relative to the `views` directory (e.g., `layouts/about.html`, not `views/layouts/about.html`). Always place layout files in the `views/layouts` directory.

Reference: [Link to documentation](https://dev.blutui.com/docs/courier/getting-started) 