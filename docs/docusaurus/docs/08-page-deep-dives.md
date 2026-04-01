---
id: 08-page-deep-dives
title: Page-By-Page Deep Dives
---

## Document Metadata
- Owner: Frontend
- Last-Verified: 2026-04-01
- Review-Cadence: Monthly
- Status: active

## What This Is
A complete walkthrough of every page entrypoint and its controller module.

## Why It Exists
Page behavior is distributed across multiple modules. This page connects each HTML page to its JavaScript logic and Firebase operations.

## How It Works Here
- `index.html` -> `backend/pages/index-page.js`: side menu, local filter toggles, local badge toggles.
- `login.html` -> `backend/pages/login-page.js`: Google sign-in and route to `account.html` or `createaccount.html`.
- `createaccount.html` -> `backend/pages/create-account-page.js`: username + bio + optional image upload, transactionally writes `users` and `usernames`.
- `add-deal.html` -> `backend/pages/add-deal-page.js`: auth/profile guard, input validation, calls `createDeal`.
- `account.html` -> `backend/pages/account-page.js`: auth/profile guard, profile edit, image upload, render deals created by current user.
- `about.html` -> `backend/pages/about-page.js`: static content plus shared menu setup.
- `test-connection.html` -> `backend/firebase-config.js`: Firebase boot and connection logging.

### Page-level breakdown
#### `index.html`
- Loads static deal cards in markup.
- `index-page.js` filters cards by class names (`food`, `groceries`, `services`, `other`).

#### `login.html`
- Renders Google sign-in button.
- `login-page.js` listens for click, triggers popup sign-in, then checks `users/{uid}` document.

#### `createaccount.html`
- Shows profile form only after sign-in.
- `create-account-page.js` validates username pattern and saves both username index and profile doc in one transaction.

#### `add-deal.html`
- Captures title, discount text, description, categories, location, time, expiration date, optional image.
- `add-deal-page.js` enforces required fields before calling service layer.

#### `account.html`
- Shows profile data and posted deals.
- `account-page.js` can upload replacement profile image and update profile doc.

#### `about.html`
- Mostly static narrative content.
- Still initializes shared side menu logic.

#### `test-connection.html`
- Diagnostic page that imports `firebase-config.js`.
- Useful to confirm config loading and permission outcomes in console.

## Annotated Snippet
```js
const userDoc = await getDoc(doc(db, "users", user.uid));
window.location.href = userDoc.exists() ? "account.html" : "createaccount.html";
```
- Reads user profile document by authenticated `uid`.
- If profile exists: redirect to account.
- If missing: redirect to account creation flow.

## Common Mistakes
- Updating navigation menu HTML on one page but not all pages.
- Assuming `index.html` currently renders live Firestore data (it does not; cards are static markup today).
- Forgetting that `voting-service.js` is currently empty.

## Official Docs Links
- Firestore get document: https://firebase.google.com/docs/firestore/query-data/get-data
- Auth with Google provider: https://firebase.google.com/docs/auth/web/google-signin
