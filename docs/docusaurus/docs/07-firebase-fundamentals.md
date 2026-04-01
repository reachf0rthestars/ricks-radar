---
id: 07-firebase-fundamentals
title: Firebase Fundamentals In This Project
---

## Document Metadata
- Owner: Firebase Owner
- Last-Verified: 2026-04-01
- Review-Cadence: Monthly
- Status: active

## What This Is
The Firebase architecture used by Rick's Radar: Auth, Firestore, Storage, Hosting, and emulators.

## Why It Exists
Firebase is the backend for this app. New contributors need a simple model of how authentication, data, file uploads, and policy enforcement fit together.

## How It Works Here
- `.firebaserc` selects project `ricksradar`.
- `firebase.json` configures Hosting, Firestore rules, Storage rules, and emulator ports.
- `public/backend/firebase-config.js` initializes and exports `auth`, `db`, and `storage`.
- Localhost routes requests to emulators using `connectAuthEmulator`, `connectFirestoreEmulator`, and `connectStorageEmulator`.

## Annotated Snippet
```js
const isLocalHost =
  window.location.hostname === "localhost" ||
  window.location.hostname === "127.0.0.1";

if (isLocalHost) {
  connectFirestoreEmulator(db, "127.0.0.1", 8080);
}
```
- Detects local browser environment.
- Redirects Firestore calls to local emulator on port `8080`.
- Prevents accidental writes to production while developing locally.

## Common Mistakes
- Forgetting emulator mode and assuming local tests affect production.
- Assuming Hosting workflows deploy Firestore/Storage rules automatically.
- Ignoring permission errors without checking the related rule block.

## Official Docs Links
- Project aliases: https://firebase.google.com/docs/cli#project_aliases
- Web setup: https://firebase.google.com/docs/web/setup
- Emulator Suite: https://firebase.google.com/docs/emulator-suite
- Hosting deploy action: https://github.com/FirebaseExtended/action-hosting-deploy

