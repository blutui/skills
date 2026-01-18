---
title: Canvas - Template Engine
impact: CRITICAL
impactDescription: 90% impact as the template engine adds interactivity with data between html elements and blutui concepts.
tags: canvas, variables, tags, filters, functions, tests, expressions, templating festures
---

## Canvas - Template Engine

**Canvas** is the template engine for Blutui that allows to build custom looks and feels for projects using a mix of HTML, CSS, JavaScript, and Canvas logic.

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