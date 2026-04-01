---
title: "about-page.js"
---

## Document Metadata
- Owner: Frontend
- Last-Verified: 2026-04-01
- Review-Cadence: Monthly
- Status: active

## Purpose
`public/backend/pages/about-page.js` is the smallest page controller in the app. It only initializes the shared side menu on `public/about.html`.

## Where It Runs
- Loaded as a module from `public/about.html`.
- Executes immediately on import.
- Has no local helpers or exports.

## Imports
- `initSideMenu` from `../shared/menu.js`

## Entry Behavior
- Calls `initSideMenu()` once at module load.
- Does not attach any page-specific handlers.
- Does not read or write Firebase data directly.

## Event Handlers
There are no page-specific event handlers in this module. All interactive behavior on the page comes from the shared menu controller and the static HTML links.

## Side Effects
- Initializes the shared menu.
- Relies on the shared menu to manage `#menu-overlay`, `#side-menu`, and the top-bar button.

## Current Limitations
- The page is fully static apart from the shared menu.
- There is no auth gating, redirect logic, or dynamic content loading.

## Related HTML Contract
The corresponding HTML page must provide:
- `#menu-overlay`
- `#side-menu`
- `#menu-btn` or the shared `.top-btn--secondary` fallback

## Source
- `public/backend/pages/about-page.js`
