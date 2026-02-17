| Title | Impact | Impact Description | Tags |
|-------|--------|-------------------|------|
| Routing Pattern Standards | CRITICAL | Strict adherence to Blutui Route Pattern standards is mandatory. Non-compliant routing triggers 500 Server Errors and breaks site navigation, leading to total loss of user access. | route, route pattern |

## Routing Pattern Standard

The agent must pay attention to route patterns when the project would require to build many pages that will include more than one nested page.

- A route pattern could include parameter(s) (e.g., `/team/:name`), which is accessed in code via `route.data.name`.
- The supported parameter types: string, slug, date, time, number.
- Each unique route pattern is mapped to a single template file.

Route patterns can be utilised to filter collections as shown below:

```canvas
{% set members = cms.collection('team') %}
{% set member = members | filter(entry => (entry.name | slug) == route.data.name) | first %}
<h1>{{ member.name }}</h1>
<p>{{ member.bio }}</p>
```

Use Blutui MCP tools to create, retreive and list route patterns.

When using the create_route-pattern tool, the agent must use the list_route-patterns tool and determine a unique route pattern.

Reference: [Link to documentation - How do I use route patterns in my project?](https://docs.blutui.com/guides/add-route-patterns)
