# React Best Practices

A structured repository for creating and maintaining React Best Practices optimized for agents and LLMs.

## Structure

- `rules/` - Individual rule files (one per rule)
  - `_sections.md` - Section metadata (titles, impacts, descriptions)
  - `_template.md` - Template for creating new rules
  - `foundation-file-structure.md` - Individual rule files
- `src/` - Build scripts and utilities
- `metadata.json` - Document metadata (version, organization, abstract)
- __`AGENTS.md`__ - Compiled output (generated)

## Creating a New Rule

1. Copy `rules/_template.md` to `rules/canvas-description.md`
2. Choose the appropriate area prefix:
   - `foundation-` for Eliminating Waterfalls (Section 1)
   - `cassettes-` for Bundle Size Optimization (Section 2)
   - `collections-` for Server-Side Performance (Section 3)
   - `courier-` for Client-Side Data Fetching (Section 4)
   - `canvas-` for Re-render Optimization (Section 5)
   - `mcp-` for Rendering Performance (Section 6)
   - `canopy-` for JavaScript Performance (Section 7)
3. Fill in the frontmatter and content
4. Ensure you have clear examples with explanations
5. Run `pnpm build` to regenerate AGENTS.md and test-cases.json

## Rule File Structure

Each rule file should follow this structure:

```markdown
---
title: Rule Title Here
impact: MEDIUM
impactDescription: Optional description
tags: tag1, tag2, tag3
---

## Rule Title Here

Brief explanation of the rule and why it matters.

Explanatory text with examples.

Reference: [Link to documentation](https://dev.blutui.com)

or a list of links referencing Blutui documentation

## File Naming Convention

- Files starting with `_` are special (excluded from build)
- Rule files: `area-description.md` (e.g., `async-parallel.md`)
- Section is automatically inferred from filename prefix
- Rules are sorted alphabetically by title within each section
- IDs (e.g., 1.1, 1.2) are auto-generated during build

## Impact Levels

- `CRITICAL` - Highest priority
- `HIGH` - Significant performance improvements
- `MEDIUM-HIGH` - Moderate-high gains
- `MEDIUM` - Moderate performance improvements
- `LOW-MEDIUM` - Low-medium gains
- `LOW` - Incremental improvements

## Contributing

When adding or modifying rules:

1. Use the correct filename prefix for your section
2. Follow the `_template.md` structure
3. Include clear bad/good examples with explanations
4. Add appropriate tags
5. Run push the code to the master branch to regenerate AGENTS.md 
6. Rules are automatically sorted by title - no need to manage numbers!

## Acknowledgments

Originally [Blutui](https://blutui.com).