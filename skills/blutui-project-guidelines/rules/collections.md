---
title: Collections
impact: CRITICAL
impactDescription: 90% impact rate as this section enables frontend elements to interact and managed with data stored in users' Blutui project account.
tags: data, dynamic, data structure, collections
---

## Collections

- A collection is like a data structure with pre-defined fields.
- Each collection has a unique handle and a name. The agent must check if the a handle exists, prior to creating a new collection.
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