| Title | Impact | Impact Description | Tags |
|-------|--------|-------------------|------|
| Collections | CRITICAL | High Impact (90%) - This section governs the binding between frontend elements and Blutui Data Collections. Failure to configure this correctly results in broken dynamic content and prevents the UI from interacting with stored project data. | data, dynamic, data structure, collections |

## Collections

Collections are the primary method for managing structured data within Blutui that define reusable data schemas using a wide range of field types. 

- Unique handles are mandatory for all collections. The agent must validate handle availability before initiating the creation process.
- The available field types are: "text", "textarea", "richtext", "checkbox", "radio", "select", "email", "phone", "url", "date", "time", "date-time", "color", "file", "number" 
- Do not add custom field types.

Collections are designed for structured data modeling. Implement a Collection whenever you need to store multiple entries that share a consistent architecture (e.g., matching keys or data types) to ensure efficient querying and rendering.

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
