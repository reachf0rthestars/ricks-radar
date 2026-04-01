---
id: shared-menu
title: Shared Navigation and Menu System
---

## Document Metadata
- Owner: Frontend
- Last-Verified: 2026-04-01
- Review-Cadence: Monthly
- Status: active

## Purpose
This module owns the slide-out menu, the overlay, the top-right profile action, and the sign-out behavior shared by every page.

## Where It Is Used
- `public/backend/pages/index-page.js`
- `public/backend/pages/login-page.js`
- `public/backend/pages/create-account-page.js`
- `public/backend/pages/account-page.js`
- `public/backend/pages/add-deal-page.js`
- `public/backend/pages/about-page.js`

## Imports and Dependencies
- Firebase auth SDK: `signOut`
- Shared Firebase auth instance: `auth`
- Shared profile helpers: `DEFAULT_AVATAR`, `getDisplayName`, `getProfileImage`, `onUserProfileChange`, `PROFILE_UPDATED_EVENT`

## Exported API
### `ensureMenuOverlay(overlaySelector = "#menu-overlay")`
Finds the menu overlay element or creates it and appends it to `document.body`.

### `initSideMenu(options = {})`
Initializes the menu button, overlay close behavior, profile badge, auth visibility, and logout handling.

Supported options:
- `menuButtonSelector`
- `sideMenuSelector`
- `overlaySelector`
- `topRightMode`

## Internal Helpers
### `getElement(selector)`
Wrapper around `document.querySelector()`.

### `findMenuLinkByHref(href)`
Finds links inside `#side-menu` by `href`.

### `setMenuAuthVisibility(isSignedIn)`
Shows or hides the account, login, and logout controls based on auth state.

### `getTopBar()`
Returns the `.top-bar` element when present.

### `ensureProfileBadge()`
Creates the top-right badge lazily if it does not already exist.

### `updateTopRightAction(badge, user, profile, topRightMode)`
Renders the badge as sign-in, log-out, or profile display depending on auth state.

### `initLogout()`
Binds the logout button to Firebase sign-out and redirects to `login.html`.

## Side Effects
- `ensureMenuOverlay()` mutates the DOM by creating `#menu-overlay` when missing.
- `initSideMenu()` binds click handlers to the menu button, overlay, Escape key, profile badge, logout button, and profile update events.
- `initSideMenu()` subscribes to auth/profile changes via `onUserProfileChange()`.

## DOM / Firebase Dependencies
- Requires `#side-menu`, `#menu-overlay`, and a menu button to exist for the full experience.
- Requires a `.top-bar` if profile badge rendering is expected.
- Requires menu links pointing to `account.html`, `login.html`, and a `#logout-btn`.
- Depends on Firebase auth state for visibility and profile badge rendering.

## Failure Modes
- If the menu button, side menu, or overlay is missing, `initSideMenu()` exits without wiring the menu.
- If `topRightMode` is set to `logout`, the badge logs the user out instead of navigating to `account.html`.
- Firestore/profile lookup failures are handled by the profile helper, but the badge can still fall back to sign-in text.
- Pages without a `.top-bar` will not receive the lazily created profile badge.

## Implementation Status
- `ensureMenuOverlay()` and `initSideMenu()`: implemented and shared.
- Internal helpers: implementation details only.
- This module is page-bootstrap infrastructure, not a general UI library.
