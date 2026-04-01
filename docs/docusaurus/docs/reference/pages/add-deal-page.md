---
title: "add-deal-page.js"
---

## Document Metadata
- Owner: Frontend
- Last-Verified: 2026-04-01
- Review-Cadence: Monthly
- Status: active

## Purpose
`public/backend/pages/add-deal-page.js` manages the interactive UI on `public/add-deal.html`. It provides category-pill selection and sets the minimum expiration date for the form.

## Where It Runs
- Loaded as a module from `public/add-deal.html`.
- Executes immediately on import.
- Assumes the page contains the category pills, hidden field, and expiration date input.

## Imports
- `initSideMenu` from `../shared/menu.js`

## Entry Behavior
The module performs three startup actions:
1. `initSideMenu()`
2. `initCategorySelection()`
3. `initExpirationDateMin()`

There are no exports.

## Internal Helpers

### `initCategorySelection()`
Adds selection behavior to the category pills.

Selector contracts:
- `.categories .category`
- `#selected-categories`

Behavior:
- Clicking a category button toggles that category in a local `Set`.
- The button gains or loses the `active` class.
- The hidden input is updated with a comma-separated list of selected category values.

Implementation details:
- Category values come from `button.dataset.value`.
- If a button has no `data-value`, the click is ignored.

### `initExpirationDateMin()`
Prevents the expiration date from being set in the past.

Selector contracts:
- `#expiration-date`

Behavior:
- Sets `min` to the current date in `YYYY-MM-DD` format.
- If the input is missing, the helper returns without doing anything.

## Event Handlers
- Category button clicks toggle active state and update the hidden input.

## Side Effects
- Mutates button classes in the category grid.
- Writes the selected category list into `#selected-categories`.
- Sets the minimum allowed value for `#expiration-date`.
- Initializes the shared side menu.

## Current Limitations
- The form does not persist submitted deals yet.
- The submit button is present in the HTML, but the page controller does not attach a submit handler.
- Category selection is local UI state only.
- The top bar menu button relies on the shared menu bootstrap; the HTML currently provides an unlabeled `top-btn--secondary` button instead of a dedicated `#menu-btn`, so the fallback selector in `initSideMenu()` matters here.

## Related HTML Contract
The corresponding HTML page must provide:
- `.categories .category`
- `#selected-categories`
- `#expiration-date`
- `.top-bar`
- `#menu-overlay`
- `#side-menu`
- `#logout-btn`

## Source
- `public/backend/pages/add-deal-page.js`
