---
id: intro
title: Start Here
---

## Document Metadata
- Owner: Docs Maintainer
- Last-Verified: 2026-04-01
- Review-Cadence: Monthly
- Status: active

## What This Is
This documentation set teaches Rick's Radar from zero. It assumes you do not know Firebase, JavaScript, HTML, or CSS.

## Why It Exists
The app has multiple moving parts: static pages, browser JavaScript modules, Firebase services, security rules, and GitHub deployment workflows. This guide explains how each part works and how they connect.

## How To Use This Site
1. Read in order from glossary to troubleshooting.
2. Open code and docs side-by-side.
3. Use the search bar to jump directly to modules, selectors, and functions.
4. Use the playbook at the end to keep docs current as code changes.

## Documentation Layers
- Conceptual guides explain the architecture and major workflows.
- Reference pages document implemented modules, helpers, event flows, and side effects.
- Contract pages explain the exact ids and classes the JavaScript expects in the HTML.

Start with [How to Use These Docs](./13-how-to-use-these-docs) if you want the fastest route to the right section.

## Annotated Snippet
```html
<script type="module" src="backend/pages/login-page.js"></script>
```
- `type="module"` enables modern JavaScript modules in the browser.
- `src="backend/pages/login-page.js"` points to the page controller for `login.html`.

## Common Mistakes
- Skipping the glossary and then getting blocked by terms.
- Reading workflows before understanding app flow.

## Official Docs Links
- Firebase docs root: https://firebase.google.com/docs
- Docusaurus docs: https://docusaurus.io/docs
