---
id: 14-html-js-dom-contracts
title: HTML-to-JS DOM Contracts
---

## Document Metadata
- Owner: Frontend
- Last-Verified: 2026-04-01
- Review-Cadence: Monthly
- Status: active

## What This Is
A contract page for the HTML files under `public/` and the page controller modules that query them.

## Why This Matters
These pages are not framework-driven. The JavaScript depends on exact IDs, classes, and structural placement in the HTML. If the markup changes, the scripts can stop working without a compile-time error.

## Shared Contract Pattern
- Every page loads a single module script from `public/backend/pages/`.
- Most pages also initialize the shared side menu.
- Many controllers require exact IDs such as `menu-btn`, `side-menu`, `menu-overlay`, and page-specific form or message elements.

## Page Entry Map
### `index.html`
- Loads `backend/pages/index-page.js`.
- Depends on `.filters`, `.deal-card`, `.badge`, `#menu-btn`, `#side-menu`, and `#menu-overlay`.

### `login.html`
- Loads `backend/pages/login-page.js`.
- Depends on `#google-login`, `#login-message`, `#menu-btn`, `#side-menu`, and `#menu-overlay`.

### `createaccount.html`
- Loads `backend/pages/create-account-page.js`.
- Depends on `#google-signup`, `#profile-form`, `#profile-img-preview`, `#username`, `#bio`, `#profileImage`, `#auth-message`, `#menu-btn`, `#side-menu`, and `#menu-overlay`.

### `account.html`
- Loads `backend/pages/account-page.js`.
- Depends on `.profile-avatar`, `.profile-name`, `.profile-bio`, `.profile-stats strong`, `#edit-profile-btn`, `#edit-profile-form`, `#edit-bio`, `#edit-profile-image`, `#cancel-profile-btn`, `#save-profile-btn`, `#edit-profile-message`, `#menu-btn`, `#side-menu`, and `#menu-overlay`.

### `add-deal.html`
- Loads `backend/pages/add-deal-page.js`.
- Depends on `.categories .category`, `#selected-categories`, `#expiration-date`, `#menu-btn`, `#side-menu`, and `#menu-overlay`.

### `about.html`
- Loads `backend/pages/about-page.js`.
- Depends on `#menu-btn`, `#side-menu`, and `#menu-overlay`.

### `test-connection.html`
- Loads `backend/firebase-config.js`.
- Depends on the Firebase config script loading successfully and the browser console for feedback.

## Selector Rules
- IDs are treated as hard dependencies.
- Class names drive filtering, badge toggles, and profile rendering.
- If a controller queries an element and it is missing, the page usually fails quietly instead of recovering.

## Practical Advice
- Update this page whenever HTML structure changes.
- Update the module reference pages whenever a controller starts using a new selector or event flow.
- Use [Page Deep Dives](./08-page-deep-dives) for a fuller narrative of each page.
- Use the page-controller reference pages under `reference/pages/` for exact selector contracts and startup behavior.
- Use the shared-module reference pages under `reference/shared/` when a DOM contract depends on menu, profile, or message helpers.
