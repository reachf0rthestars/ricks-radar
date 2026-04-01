---
title: "create-account-page.js"
---

## Document Metadata
- Owner: Frontend
- Last-Verified: 2026-04-01
- Review-Cadence: Monthly
- Status: active

## Purpose
`public/backend/pages/create-account-page.js` manages the account-completion flow on `public/createaccount.html`. It signs the user in with Google, checks whether a profile already exists, and if not, collects username, bio, and optional profile image before creating the account transactionally.

## Where It Runs
- Loaded as a module from `public/createaccount.html`.
- Executes immediately on import.
- Assumes the auth card form fields exist and are wired exactly as the JavaScript expects.

## Imports
- `GoogleAuthProvider`, `onAuthStateChanged`, `signInWithPopup` from Firebase Auth CDN
- `doc`, `getDoc`, `runTransaction`, `serverTimestamp` from Firebase Firestore CDN
- `getDownloadURL`, `ref`, `uploadBytes` from Firebase Storage CDN
- `auth`, `db`, `storage` from `../firebase-config.js`
- `setStatusMessage` from `../shared/messages.js`
- `initSideMenu` from `../shared/menu.js`

## Entry Behavior
The module wires the Google sign-in button, the profile form, and the auth-state observer.

There are no exports.

## Internal Helpers

### `setFormVisibility(isVisible)`
Shows or hides the profile form and Google sign-in button.

Selector contracts:
- `#profile-form`
- `#google-signup`

### `setLoading(isLoading, buttonText = "Save Profile")`
Updates the disabled state and button label while auth or save work is happening.

Selector contracts:
- `#google-signup`
- `#profile-form button[type='submit']`

### `validateUsername(username)`
Validates usernames against the local pattern.

Rules:
- 3 to 20 characters
- letters, numbers, or underscore only

### `getUsernameKey(username)`
Normalizes the username for use as the Firestore document id in `usernames`.

Behavior:
- Trims whitespace
- Lowercases the username

### `sanitizeFileName(name)`
Removes unsafe filename characters before upload.

Behavior:
- Replaces any character outside `a-z`, `A-Z`, `0-9`, `.`, `_`, `-` with `_`

### `routeUser(user)`
Decides whether the user should see the account-completion form or be redirected.

Behavior:
- If no user is signed in, it hides the form, resets the preview image, and clears the message area.
- If a user exists, it shows their Google avatar as the preview.
- If `users/{uid}` already exists, it redirects to `account.html`.
- Otherwise it reveals the profile form and asks the user to complete setup.

### `uploadProfileImage(user)`
Uploads the optional profile image.

Behavior:
- If no file is selected, it returns the user photo URL or an empty string.
- Otherwise it uploads the file to `profileImages/{uid}/{timestamp}-{filename}` and returns the download URL.

### `saveProfile(user, username, bio, profileImageURL)`
Creates or updates the `users/{uid}` document and the username index in a single Firestore transaction.

Behavior:
- Checks whether the username already exists.
- Throws `USERNAME_TAKEN` if another user owns the username.
- Preserves existing counters and timestamps where available.
- Stores username metadata in `usernames/{usernameKey}`.

Dependencies:
- Firestore `users` and `usernames` collections
- `serverTimestamp()`

## Event Handlers
- `#google-signup` click starts the Google popup sign-in flow.
- `#profile-form` submit validates the form, uploads the image if needed, saves the profile, and redirects to `account.html`.
- `onAuthStateChanged(auth, ...)` calls `routeUser(user)` whenever auth state changes.

## Redirects and Auth Gates
- Signed-in users with existing `users/{uid}` documents are sent straight to `account.html`.
- Users must sign in with Google before the profile form can be saved.
- A missing or invalid username or empty bio stops submission before any writes happen.

## Side Effects
- Reads Firestore to detect existing accounts and username collisions.
- Uploads optional images to Firebase Storage.
- Writes to Firestore inside a transaction.
- Mutates form visibility, button text, and message content.
- Initializes the shared menu.

## Current Limitations
- Username uniqueness is enforced only by the `usernames/{usernameKey}` document convention.
- The page does not support editing an existing profile; that is handled by `account-page.js`.
- The form only saves the fields that currently exist in the code: username, bio, and optional avatar.
- There is no client-side debounce or server-side validation beyond the transaction check.

## Related HTML Contract
The corresponding HTML page must provide:
- `#google-signup`
- `#profile-form`
- `#profile-img-preview`
- `#username`
- `#bio`
- `#profileImage`
- `#auth-message`
- `#menu-overlay`
- `#side-menu`
- `#menu-btn`

## Source
- `public/backend/pages/create-account-page.js`
