---
title: "index-page.js"
---

## Document Metadata
- Owner: Frontend
- Last-Verified: 2026-04-01
- Review-Cadence: Monthly
- Status: active

## Purpose
`public/backend/pages/index-page.js` is the browser entrypoint for `public/index.html`. It bootstraps the shared side menu, filter controls, and like/dislike badge toggles for the landing page.

## Where It Runs
- Loaded as a module from `public/index.html`.
- Executes immediately on import.
- Depends on the static card markup that already exists in `index.html`.

## Imports
- `initSideMenu` from `../shared/menu.js`

## Entry Behavior
The module performs three startup actions in order:
1. `initSideMenu()`
2. `initFilters()`
3. `initVoteBadges()`

There are no exports. This is a pure page bootstrap module.

## Internal Helpers

### `initFilters()`
Sets up category filtering for deal cards.

Selector contracts:
- `.filters` must exist.
- `.pill--primary` must exist inside `.filters`.
- `button:not(.pill--primary)` inside `.filters` are treated as filter toggles.
- `.deal-card` elements are the filter targets.

Behavior:
- Clicking the primary pill toggles the visibility of the filter row with the `show-filters` class.
- Clicking a category pill toggles that category in a local `Set`.
- Cards are shown when they match at least one active filter.
- Cards are shown by default when no filters are active.

Implementation details:
- A card matches if it contains an element with a class that matches one of the active filter names, such as `.food` or `.groceries`.
- The helper uses a nested `applyFilters()` closure to re-evaluate the current filter set.

### `initVoteBadges()`
Adds local click toggles to every `.badge` element.

Selector contracts:
- `.badge` elements must already exist in the HTML.

Behavior:
- Clicking a badge toggles the `active` class on that badge.
- No persistence occurs.
- No Firestore writes occur.

## Event Handlers
- Category pill clicks update filter state and rerender visible cards.
- Badge clicks toggle a visual active state only.
- The primary filter button toggles the filter tray open and closed.

## Side Effects
- Manipulates inline `style.display` on `.deal-card` elements.
- Adds and removes `active` classes on badge elements.
- Adds and removes `show-filters` on `.filters`.
- Registers shared menu behavior through `initSideMenu()`.

## Current Limitations
- Cards are static markup; this page does not fetch live deal data.
- Filtering is purely DOM-based and only works on the classes already present in the rendered cards.
- Badge clicks are visual only and do not affect any backend state.
- If `.filters` or `.deal-card` is missing, the page silently skips the related behavior rather than failing hard.

## Related HTML Contract
The corresponding HTML page must provide:
- `#menu-overlay`
- `#side-menu`
- `#menu-btn` or a `.top-btn--secondary` fallback button
- `.filters`
- `.deal-card`
- `.badge`

## Source
- `public/backend/pages/index-page.js`
