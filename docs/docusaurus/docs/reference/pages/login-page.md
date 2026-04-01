---
title: "login-page.js"
---

## Document Metadata
- Owner: Frontend
- Last-Verified: 2026-04-01
- Review-Cadence: Monthly
- Status: active

## Purpose
`public/backend/pages/login-page.js` powers the Google sign-in flow on `public/login.html`. It signs the user in, checks whether a profile document exists, and redirects them to the correct next page.

## Where It Runs
- Loaded as a module from `public/login.html`.
- Executes immediately on import.
- Assumes the login form and message node already exist in the DOM.

## Imports
- `GoogleAuthProvider`, `onAuthStateChanged`, `signInWithPopup` from Firebase Auth CDN
- `doc`, `getDoc` from Firebase Firestore CDN
- `auth`, `db` from `../firebase-config.js`
- `setStatusMessage` from `../shared/messages.js`
- `initSideMenu` from `../shared/menu.js`

## Entry Behavior
The module wires the sign-in button, watches auth state, and initializes the shared side menu.

There are no exports.

## Internal Helpers

### `routeUser(user)`
Routes an authenticated user to the right page.

Behavior:
- If `user` is null, it returns without doing anything.
- It reads `users/{uid}` from Firestore.
- If the document exists, it redirects to `account.html`.
- If the document is missing, it redirects to `createaccount.html`.

Dependencies:
- `db`
- Firestore `users` collection

### `setLoading(isLoading)`
Updates the sign-in button state.

Selector contracts:
- `#google-login` must exist.

Behavior:
- Disables the button while the popup flow is active.
- Switches the button text between `Signing in...` and `Sign in with Google`.

## Event Handlers
- `#google-login` click starts `signInWithPopup(auth, new GoogleAuthProvider())`.
- `onAuthStateChanged(auth, ...)` calls `routeUser(user)` whenever auth state changes.

## Redirects and Auth Gates
- Signed-in users with an existing profile go to `account.html`.
- Signed-in users without a profile go to `createaccount.html`.
- The page does not block access before sign-in, but the auth observer can redirect away as soon as a user is known.

## Side Effects
- Reads Firestore account state.
- Mutates the login button text and disabled state.
- Writes status messages into `#login-message`.
- Initializes the shared menu and its auth-aware UI state.

## Current Limitations
- The page does not support email/password sign-in.
- There is no manual retry state beyond the popup flow and status message.
- A popup-close error is handled explicitly, but other Firebase Auth errors are surfaced generically.

## Related HTML Contract
The corresponding HTML page must provide:
- `#google-login`
- `#login-message`
- `#menu-overlay`
- `#side-menu`
- `#menu-btn`

## Source
- `public/backend/pages/login-page.js`
