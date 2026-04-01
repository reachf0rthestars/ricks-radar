---
id: 04-html-foundations
title: HTML Foundations With App Examples
---

## Document Metadata
- Owner: Frontend
- Last-Verified: 2026-04-01
- Review-Cadence: Monthly
- Status: active

## What This Is
How the app uses HTML to define structure and user inputs.

## Why It Exists
Every JavaScript behavior depends on element IDs, classes, and form fields defined in HTML.

## How It Works Here
- Each page has:
  - Menu overlay and side menu markup.
  - Top bar with menu button.
  - Page-specific content (forms, cards, profile layout).
- Form controls in `add-deal.html` and `createaccount.html` provide values read by JavaScript.

### Required page coverage
- `index.html`: static deals list markup and filter controls.
- `login.html`: sign-in call to action and auth status message container.
- `createaccount.html`: profile creation form and preview image.
- `add-deal.html`: deal creation form with categories and file input.
- `account.html`: profile header, edit form, and user deals container.
- `about.html`: static mission content and call-to-action button.
- `test-connection.html`: minimal diagnostic page that imports Firebase bootstrap.

## Annotated Snippet
```html
<form id="add-deal-form" class="auth-form">
  <input id="deal-title" name="title" type="text" required>
  <input type="hidden" name="categories" id="selected-categories">
  <button id="submit-deal-btn" class="auth-btn" type="submit">Submit Deal</button>
</form>
```
- `id` is used by JavaScript to find elements.
- `name` controls the key returned by `FormData`.
- Hidden input stores selected category values from button clicks.

## Common Mistakes
- Renaming an `id` in HTML without updating JavaScript selectors.
- Removing required attributes and breaking expected validation behavior.

## Official Docs Links
- HTML forms: https://developer.mozilla.org/docs/Learn_web_development/Extensions/Forms
