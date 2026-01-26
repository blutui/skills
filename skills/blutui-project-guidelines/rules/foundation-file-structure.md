| Title | Impact | Impact Description | Tags |
|-------|--------|-------------------|------|
| File Structure | CRITICAL | Structural Integrity - Adherence to the Blutui file structure is mandatory. Deviating from these conventions breaks core system compatibility, rendering the project non-functional and preventing deployment. | project, file structure, public, views, assets, pages, layouts, templates, components |

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
