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
- `add-deal.html` -> `backend/pages/add-deal-page.js`: side menu, category selection UI, expiration-date minimum; no persistence logic yet.
- `account.html` -> `backend/pages/account-page.js`: auth/profile guard, profile edit, image upload, static "Your Deals" markup.
- `about.html` -> `backend/pages/about-page.js`: static content plus shared menu setup.
- `test-connection.html` -> `backend/firebase-config.js`: Firebase boot and connection logging.

### Page-level breakdown
#### `index.html`
- Loads static deal cards in markup.
- `index-page.js` filters cards by class names (`food`, `groceries`, `services`, `other`).
- Required selectors include `.filters`, `.deal-card`, `.badge`, `#side-menu`, and `#menu-overlay`.
- Full controller reference: [index-page.js](./reference/pages/index-page)

#### `login.html`
- Renders Google sign-in button.
- `login-page.js` listens for click, triggers popup sign-in, then checks `users/{uid}` document.
- Required selectors include `#google-login`, `#login-message`, `#side-menu`, and `#menu-overlay`.
- Full controller reference: [login-page.js](./reference/pages/login-page)

#### `createaccount.html`
- Shows profile form only after sign-in.
- `create-account-page.js` validates username pattern and saves both username index and profile doc in one transaction.
- Required selectors include `#google-signup`, `#profile-form`, `#profile-img-preview`, `#username`, `#bio`, and `#auth-message`.
- Full controller reference: [create-account-page.js](./reference/pages/create-account-page)

#### `add-deal.html`
- Captures title, discount text, description, categories, location, time, expiration date, optional image.
- `add-deal-page.js` currently manages category-pill selection and the minimum expiration date only.
- The form still has no submit handler or service call.
- Full controller reference: [add-deal-page.js](./reference/pages/add-deal-page)

#### `account.html`
- Shows profile data and posted deals.
- `account-page.js` can upload replacement profile image and update profile doc.
- Redirects unauthenticated users to `login.html` and users without profile docs to `createaccount.html`.
- Full controller reference: [account-page.js](./reference/pages/account-page)

#### `about.html`
- Mostly static narrative content.
- Still initializes shared side menu logic.
- Full controller reference: [about-page.js](./reference/pages/about-page)

#### `test-connection.html`
- Diagnostic page that imports `firebase-config.js`.
- Useful to confirm config loading and permission outcomes in console.
- Shared bootstrap reference: [Firebase Bootstrap and Services](./reference/shared/shared-firebase-config)

## DOM Contract Reminder
- The shared menu assumes `#side-menu`, `#menu-overlay`, and a menu button exist.
- Profile and auth pages depend on exact ids rather than generic form discovery.
- Use [HTML-to-JS DOM Contracts](./14-html-js-dom-contracts) before changing markup.

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
- Assuming `add-deal-page.js` already saves deals. It does not.

## Official Docs Links
- Firestore get document: https://firebase.google.com/docs/firestore/query-data/get-data
- Auth with Google provider: https://firebase.google.com/docs/auth/web/google-signin
