| Title | Impact | Impact Description | Tags |
|-------|--------|-------------------|------|
| Templates and Layouts | CRITICAL | Functional Impact - Blutui templates and layouts govern core project logic. Deviating from these structures results in broken inheritance and rendering failures, preventing the project from functioning as intended. | project, file structure, views, templates, pages, layouts |

## Layouts and Templates

### Templates

- A template defines the overall structure of the project, including common elements like headers, footers, and navigation menus used to provide a consistent look and feel across multiple pages in a project. 
- A template can be extended by another template file but not a layout.

### Layouts

- The layouts folder is the primary way to create pages in Blutui. When you create a page in the dashboard, you link it to a specific layout file. This approach allows you to define the structure and design of your pages while giving content editors the flexibility to create and manage pages directly from the dashboard.
- When using the `layout`, `template`, `post_layout` or `blog_layout` parameters in any Blutui MCP tool, make sure the layout file path is relative to the `views` directory (e.g., `layouts/about.html`, not `views/layouts/about.html`). 
- Always place layout files in the `views/layouts` directory.

Reference: [Link to documentation - How to create a Layout](https://docs.blutui.com/guides/create-layout) 
