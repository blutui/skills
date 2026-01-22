> title: Templates and Layouts
> impact: CRITICAL
> impactDescription: Functional Impact - Blutui templates and layouts govern core project logic. Deviating from these structures results in broken inheritance and rendering failures, preventing the project from functioning as intended.
> tags: project, file structure, views, templates, pages, layouts

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