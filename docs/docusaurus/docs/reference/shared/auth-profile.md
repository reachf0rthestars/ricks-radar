---
id: shared-auth-profile
title: Shared Auth and Profile Helpers
---

## Document Metadata
- Owner: Frontend
- Last-Verified: 2026-04-01
- Review-Cadence: Monthly
- Status: active

## Purpose
This module centralizes profile lookup, display-name resolution, profile image selection, and cross-page profile update signaling.

## Where It Is Used
- `public/backend/shared/menu.js`
- `public/backend/pages/account-page.js`
- Any page that needs to read the active user profile or react to profile changes

## Imports and Dependencies
- Firebase auth SDK: `onAuthStateChanged`
- Firebase Firestore SDK: `doc`, `getDoc`
- Shared Firebase services: `auth`, `db`
- Browser DOM event system for custom profile events

## Exported API
### `DEFAULT_AVATAR`
Fallback avatar URL used when no profile image is available.

### `PROFILE_UPDATED_EVENT`
Custom event name emitted when a profile is updated.

### `getDisplayName(user, profile = {})`
Returns the best available display name in this order:
`profile.username`, `profile.displayName`, `user.displayName`, `"User"`.

### `getProfileImage(user, profile = {}, fallback = DEFAULT_AVATAR)`
Returns the best available profile image in this order:
`profile.profileImage`, `user.photoURL`, `fallback`.

### `getUserProfileDoc(user)`
Asynchronously reads `users/{uid}` from Firestore and returns the document data when it exists.

### `onUserProfileChange(callback)`
Registers an auth observer that resolves the current Firestore profile, then invokes `callback({ user, profile })`.

### `emitProfileUpdated(profile)`
Dispatches a browser `CustomEvent` named `PROFILE_UPDATED_EVENT` with the updated profile in `detail.profile`.

## Internal Helpers
There are no private named helpers in this module. The exported functions are the full API surface.

## Side Effects
- `onUserProfileChange()` subscribes to Firebase auth state and performs Firestore reads whenever auth changes.
- `emitProfileUpdated()` broadcasts an in-page DOM event.

## DOM / Firebase Dependencies
- `getUserProfileDoc()` requires a signed-in user and a readable `users/{uid}` document.
- `onUserProfileChange()` depends on Firebase auth state and may emit `profile: null` when no document exists.
- `emitProfileUpdated()` depends on the document event system being available.

## Failure Modes
- Passing `null` to `getUserProfileDoc()` returns `null` instead of throwing.
- Missing `users/{uid}` documents return `null`, which downstream code must handle.
- Firestore read failures are caught inside `onUserProfileChange()` and logged to the console.
- Callers should not assume `profile` is always present in the callback payload.

## Implementation Status
- Exported constants: implemented.
- Lookup and display helpers: implemented and stable within the current app.
- Event bridge helpers: implemented and used by shared navigation/account UI.
