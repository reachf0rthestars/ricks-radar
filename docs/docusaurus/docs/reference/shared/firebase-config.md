---
id: shared-firebase-config
title: Firebase Bootstrap and Services
---

## Document Metadata
- Owner: Frontend / Firebase
- Last-Verified: 2026-04-01
- Review-Cadence: Monthly
- Status: active

## Purpose
This module initializes the Firebase app once and exports the shared client services used across the site.

## Where It Is Used
- `public/backend/pages/login-page.js`
- `public/backend/pages/create-account-page.js`
- `public/backend/pages/account-page.js`
- `public/backend/pages/add-deal-page.js` indirectly through shared menu and profile helpers
- `public/backend/shared/auth-profile.js`
- `public/backend/shared/menu.js`
- `public/test-connection.html`

## Imports and Dependencies
- Firebase app SDK: `initializeApp`
- Firebase auth SDK: `getAuth`
- Firebase storage SDK: `getStorage`
- Firebase firestore SDK: `getFirestore`, `collection`, `query`, `getDocs`, `limit`

## Exported API
### `db`
Firestore instance for the configured app.

### `auth`
Auth instance for the configured app.

### `storage`
Storage instance for the configured app.

## Internal Helpers
### `testFirebaseConfig()`
Private startup probe that attempts a lightweight Firestore read against `connection_test`.

Behavior:
- Logs that Firebase initialization started.
- Builds a query with `collection(db, "connection_test")` and `limit(1)`.
- Calls `getDocs()` to verify the config and permissions path.
- Logs success or a detailed error to the console.

This is not a stable API and should be treated as a boot diagnostic only.

## Side Effects
- Calls `initializeApp(firebaseConfig)` immediately on module load.
- Exports configured services immediately after initialization.
- Runs `testFirebaseConfig()` immediately on module load.
- Writes status information to the developer console.

## DOM / Firebase Dependencies
- No DOM dependencies.
- Requires a valid Firebase project configuration and a readable `connection_test` collection for the probe to succeed.
- If Firestore rules block reads, the app can still function, but the console probe will report failure.

## Failure Modes
- Invalid Firebase config values prevent app initialization.
- Firestore permissions can cause the startup probe to fail even if auth and storage are working.
- The probe uses a real Firestore read, so it may log an error in environments where the collection does not exist.
- Because the module has load-time side effects, importing it in diagnostics pages also triggers the probe.

## Implementation Status
- `db`, `auth`, and `storage`: implemented and shared.
- `testFirebaseConfig()`: internal diagnostic helper.
- This module is runtime infrastructure, not a reusable business-logic layer.
