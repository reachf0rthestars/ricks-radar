---
id: 01-glossary
title: Glossary (Zero-Prerequisite)
---

## Document Metadata
- Owner: Docs Maintainer
- Last-Verified: 2026-04-01
- Review-Cadence: Monthly
- Status: active

## What This Is
A beginner dictionary for terms used in the codebase.

## Why It Exists
Most confusion starts with vocabulary. This page removes that blocker.

## How It Works Here
- HTML: page structure in `public/*.html`.
- CSS: styles in `public/css/*.css`.
- JavaScript: browser logic in `public/backend/**/*.js`.
- Firebase Auth: sign-in and identity.
- Firestore: document database for profiles and deals.
- Firebase Storage: image uploads.
- Security Rules: policy files controlling read/write access.
- Emulator Suite: local Firebase sandbox for testing.

## Annotated Snippet
```js
export const db = getFirestore(app);
```
- `export` makes `db` usable in other files.
- `getFirestore(app)` creates a Firestore connection for this Firebase app.

## Common Mistakes
- Treating Firestore rules like optional docs. They are required authorization logic.
- Assuming browser JavaScript can bypass security rules. It cannot.

## Official Docs Links
- Web setup: https://firebase.google.com/docs/web/setup
- Firestore: https://firebase.google.com/docs/firestore
- Storage: https://firebase.google.com/docs/storage
- Auth: https://firebase.google.com/docs/auth
