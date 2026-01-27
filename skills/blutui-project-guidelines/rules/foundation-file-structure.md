| Title | Impact | Impact Description | Tags |
|-------|--------|-------------------|------|
| File Structure | CRITICAL | Structural Integrity - Adherence to the Blutui file structure is mandatory. Deviating from these conventions breaks core system compatibility, rendering the project non-functional and preventing deployment. | project, file structure, public, views, assets, pages, layouts, templates, components |

## File structure

### "/public" directory

Store assets including complied JS/CSS, images and static PDFs.

### "/views" directory

This folder is the primary environment for UI development. Follow these sub-directory conventions:

* "templates/": Has files with reusable design bases and system views. 
   * "default.html": The foundational template for a Blutui project. This file forms the outermost structure of a Blutui project. It features essential sections like the head, where style definitions reside, and the body, where content gets placed. The most efficient way to build upon this file is by using inheritance, capitalising on the block tag.
   * "404.html": A template for handling "Page Not Found" errors.
* "layouts/": The layouts folder is the primary way to create pages in a project.
* Custom Directories (e.g., "components/"): Custom directories added for atomic, reusable UI fragments or any other purposes.

Develop the project using a component-first approach. By modularizing the front-end logic into reusable blocks, minimize duplicate work and ensure that design updates stay consistent across all project views.

#### Understanding inheritence in Blutui

Hierarchy Instruction:

* Parent: templates/default.html (Defines the overall structure).
* Child: views/pages/index.html (Provides specific page content).

To implement this, ensure the child file begins with the `extends` declaration. Map your content to the parent's placeholders by wrapping your HTML in matching `block` names. This ensures precise placement of CSS and body content.

Reference: [Link to documentation](https://docs.blutui.com/docs/getting-started/folder-structure)
