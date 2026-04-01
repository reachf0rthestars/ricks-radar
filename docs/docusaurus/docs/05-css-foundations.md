---
id: 05-css-foundations
title: CSS Foundations With App Examples
---

## Document Metadata
- Owner: Frontend
- Last-Verified: 2026-04-01
- Review-Cadence: Monthly
- Status: active

## What This Is
How visual styling is split across `base.css`, `components.css`, `pages.css`, and inline page styles.

## Why It Exists
Beginners need to understand where style decisions live and why duplicates can create drift.

## How It Works Here
- `base.css`: variables, reset, global layout.
- `components.css`: reusable UI blocks (top bar, pills, deal cards, side menu, profile blocks).
- `pages.css`: auth and page-specific style layers.
- Several HTML files still add inline `<style>` blocks that override shared styles.

### Inline override locations
- `login.html`
- `createaccount.html`
- `add-deal.html`
- `about.html`

## Annotated Snippet
```css
:root {
  --green: #59C309;
  --blue: #026BE3;
  --bg: #f7f7f7;
}
```
- CSS custom properties define reusable design tokens.
- Other selectors reference them with `var(--green)` and `var(--blue)`.

## Common Mistakes
- Defining the same component style in multiple files without documenting precedence.
- Adding page inline styles when reusable component styles should be used.

## Official Docs Links
- CSS basics: https://developer.mozilla.org/docs/Learn_web_development/Core/Styling_basics
- CSS custom properties: https://developer.mozilla.org/docs/Web/CSS/Using_CSS_custom_properties
