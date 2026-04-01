---
id: 02-system-overview
title: System Overview
---

## Document Metadata
- Owner: Engineering
- Last-Verified: 2026-04-01
- Review-Cadence: Monthly
- Status: active

## What This Is
A high-level map of the app from browser request to Firebase data access.

## Why It Exists
You need context before deep diving into individual files.

## How It Works Here
1. User opens a page in `public/`.
2. Page loads shared CSS and one page-specific module.
3. JavaScript imports `firebase-config.js`.
4. Firebase services initialize (`auth`, `db`, `storage`).
5. Page code performs auth checks, reads/writes Firestore, uploads images to Storage.
6. Firestore/Storage rules allow or reject each operation.

## Annotated Snippet
```js
onAuthStateChanged(auth, async (user) => {
  if (!user) {
    window.location.href = "login.html";
    return;
  }
});
```
- `onAuthStateChanged` listens for login state.
- If `user` is missing, the page redirects to login.
- This is a client-side guard. Server-side authorization is still enforced by rules.

## Common Mistakes
- Assuming redirects are security. They improve UX, but rules are actual security.
- Forgetting that `firebase-config.js` has startup side effects (connection test query).

## Official Docs Links
- Auth state observer: https://firebase.google.com/docs/auth/web/start
- Firestore security model: https://firebase.google.com/docs/firestore/security/get-started

