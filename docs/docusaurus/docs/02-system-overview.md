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
1. User opens a static HTML page in `public/`.
2. The page loads shared CSS and one browser ES module from `public/backend/pages/` or `public/backend/firebase-config.js`.
3. That module imports shared helpers and, when needed, `firebase-config.js`.
4. `firebase-config.js` initializes `auth`, `db`, and `storage`, then immediately runs a Firestore connection probe.
5. The page controller binds auth observers, event handlers, and redirect logic directly in the browser.
6. Firestore reads/writes and Storage uploads run from the client against Firebase services.
7. Firebase security rules, not client redirects, determine what data access is allowed.

## Runtime Shape
- The active browser app lives in `public/`.
- Each HTML file is its own entrypoint and owns its own controller module.
- Shared behavior lives in `public/backend/shared/`.
- Some behavior is implemented as named functions, and some is implemented as module-load side effects or anonymous event handlers.
- `deals-service.js` and `voting-service.js` exist as placeholders today rather than complete services.

## Where To Go Next
- Read [Page Deep Dives](./08-page-deep-dives) for HTML-to-controller wiring.
- Read [HTML-to-JS DOM Contracts](./14-html-js-dom-contracts) before changing selectors.
- Read the reference section for exact function-level behavior.

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
- Assuming every page reads live Firestore data. Several pages are mostly DOM/UI behavior today.

## Official Docs Links
- Auth state observer: https://firebase.google.com/docs/auth/web/start
- Firestore security model: https://firebase.google.com/docs/firestore/security/get-started

