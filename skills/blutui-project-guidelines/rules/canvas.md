| Title | Impact | Impact Description | Tags |
|-------|--------|-------------------|------|
| Canvas - Template Engine | CRITICAL | High Impact (90%) - The Template Engine serves as the critical logic layer, binding HTML elements to Blutui-specific concepts. Strict adherence to this syntax is mandatory for data interactivity; without it, the project will fail to render or process dynamic data. | canvas, variables, tags, filters, functions, tests, expressions, templating festures |

## Canvas - Template Engine

Canvas serves as the template engine for Blutui, combining HTML, CSS, and JavaScript with unique Canvas logic to create fully customized project designs.

- The template is a regular text file. It can generate any text-based format (HTML, XML, CSV, LaTeX, etc.). The file extension is ".canvas".
- A template contains variables, tags, filters, functions, tests, expressions and other templating festures, which get replaced with values when the template is evaluated, and tags, which control the template's logic.

**Example** 

```canvas
<!DOCTYPE html>
<html>
  <head>
    <title>My Webpage</title>
  </head>

  <body>
    <ul id="navigation">
      {% for item in navigation>
        <li><a href="{{ item.href }}">{{ item.caption }}</a></li>
      {% endfor %}
    </ul>

    <h1>My Webpage</h1>
    {{ a_variable }}
  </body>
</html>
```

- There are two kinds of delimiters: 
    - {% ...> : Used for executing statements.
    - {{ ... }} : Used for printing values to the rendered page.

- Use the search_blutui_documentation tool in Blutui MCP to find more information on available tags, filters, functions, tests, expressions and other templating festures.

Reference: [Link to documentation](https://dev.blutui.com/guides/what-is-blutui-canvas)
