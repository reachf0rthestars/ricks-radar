---
title: "account-page.js"
---

## Document Metadata
- Owner: Frontend
- Last-Verified: 2026-04-01
- Review-Cadence: Monthly
- Status: active

## Purpose
`public/backend/pages/account-page.js` powers the signed-in account screen on `public/account.html`. It loads the current user's profile, renders the profile header, and lets the user edit their bio and profile image.

## Where It Runs
- Loaded as a module from `public/account.html`.
- Executes immediately on import.
- Hides the body until auth state has been checked.

## Imports
- `onAuthStateChanged` from Firebase Auth CDN
- `doc`, `getDoc`, `serverTimestamp`, `updateDoc` from Firebase Firestore CDN
- `getDownloadURL`, `ref`, `uploadBytes` from Firebase Storage CDN
- `auth`, `db`, `storage` from `../firebase-config.js`
- `DEFAULT_AVATAR`, `emitProfileUpdated`, `getDisplayName`, `getProfileImage` from `../shared/auth-profile.js`
- `initSideMenu` from `../shared/menu.js`
- `setStatusMessage` from `../shared/messages.js`

## Entry Behavior
The module binds edit controls, loads the current profile after auth resolves, and initializes the shared menu in logout mode.

There are no exports.

## Internal Helpers

### `toSafeCount(value)`
Converts profile counters to display-safe numbers.

Behavior:
- Returns a numeric value when possible
- Falls back to `0` for invalid or missing values

### `updateProfileUI(user, profile = {})`
Renders the profile header and stats.

Selector contracts:
- `.profile-avatar`
- `.profile-name`
- `.profile-bio`
- `.profile-stats strong`

Behavior:
- Uses `getDisplayName()` and `getProfileImage()` to fill the header.
- Displays `Tell us about yourself.` when no bio exists.
- Renders `dealsPosted`, `likes`, `followers`, and `savedDeals` as safe counts.

### `setEditFormVisibility(isVisible)`
Shows or hides the edit form.

Selector contracts:
- `#edit-profile-form`
- `#edit-profile-btn`

### `sanitizeFileName(name)`
Sanitizes uploaded image filenames before Storage writes.

### `setEditLoading(isLoading)`
Toggles edit-form controls while the save request is in flight.

Selector contracts:
- `#save-profile-btn`
- `#cancel-profile-btn`
- `#edit-profile-btn`

### `populateEditForm(profile = {})`
Fills the edit form from the current profile object.

Behavior:
- Copies the bio into `#edit-bio`
- Clears the file input in `#edit-profile-image`

### `uploadProfileImageIfNeeded(user)`
Uploads a replacement avatar only when the user selected a file.

Behavior:
- Returns the current profile image or Google photo URL when no file is selected.
- Uploads to `profileImages/{uid}/{timestamp}-{filename}` when a file is present.

### `saveProfileChanges(event)`
Handles the edit form submit event.

Behavior:
- Prevents the default form submit.
- Requires both `currentUser` and `currentProfile`.
- Rejects an empty bio.
- Uploads a new image if needed.
- Updates `users/{uid}` with `bio`, `profileImage`, and `updatedAt`.
- Refreshes the local profile object.
- Emits `profile:updated` so the shared menu can refresh its badge.
- Collapses the form on success.

Dependencies:
- Firestore `users/{uid}`
- Firebase Storage for optional image replacement

## Event Handlers
- `#edit-profile-btn` click opens or closes the form.
- `#cancel-profile-btn` click restores the current values and closes the form.
- `#edit-profile-form` submit calls `saveProfileChanges`.
- `onAuthStateChanged(auth, ...)` gates the page and loads profile data.

## Redirects and Auth Gates
- Unauthenticated users are redirected to `login.html`.
- Authenticated users without a `users/{uid}` document are redirected to `createaccount.html`.
- The body stays hidden until auth and profile loading complete.

## Side Effects
- Reads the current user profile from Firestore.
- Updates the profile document with edited values.
- Uploads replacement avatars to Firebase Storage.
- Mutates the document body visibility.
- Writes status messages into the edit panel.
- Initializes the shared menu with `topRightMode: "logout"`.

## Current Limitations
- The page only edits `bio` and `profileImage`; it does not edit username or other profile fields.
- The rendered "Your Deals" section is static markup and is not wired to live deal data.
- If profile loading fails, the code logs the error but does not present a dedicated error state beyond the hidden body behavior.

## Related HTML Contract
The corresponding HTML page must provide:
- `.profile-avatar`
- `.profile-name`
- `.profile-bio`
- `.profile-stats strong`
- `#edit-profile-btn`
- `#edit-profile-form`
- `#edit-bio`
- `#edit-profile-image`
- `#cancel-profile-btn`
- `#save-profile-btn`
- `#edit-profile-message`
- `#menu-overlay`
- `#side-menu`
- `#menu-btn`

## Source
- `public/backend/pages/account-page.js`
