---
title: Cassettes - Project Version Control
impact: LOW
impactDescription: Version Control Impact - High. This configuration is critical only during project version transitions. Incorrect setup will block the ability to switch versions or result in environment mismatches during a migration.
tags: cassette, version control
---

## Cassettes

Blutui Cassettes function as a version control system for your front-end logic, allowing you to manage and toggle between various website designs within a single project.

Each project can have multiple cassettes.

To switch cassettes, update the cassette property within the `courier.json` file. If this property is missing or undefined, prompt the user to provide the specific cassette handle.

Reference: [Link to documentation](https://dev.blutui.com/docs/cassettes/getting-started)
