---
id: 12-troubleshooting-and-pitfalls
title: Troubleshooting and Known Pitfalls
---

## Document Metadata
- Owner: Engineering
- Last-Verified: 2026-04-01
- Review-Cadence: Monthly
- Status: active

## What This Is
Known issues, expected permission failures, and quick diagnosis steps.

## Why It Exists
Most problems are configuration or rules mismatches. This page shortens debugging time.

## How It Works Here
### Expected behavior to document clearly
- `firebase-config.js` runs a Firestore test read on import.
- `connection_test` read may fail because the collection does not exist or current rules reject it.
- Homepage cards are currently static HTML, not Firestore queries.
- `add-deal.html` currently has no persistence logic.
- `voting-service.js` is currently empty.

### Real failure patterns in this codebase
- Missing DOM ids or classes break page controllers because selectors are hard-coded.
- Auth observers can redirect unexpectedly when `users/{uid}` documents are missing.
- Username collisions surface as `USERNAME_TAKEN` in the create-account transaction.
- Profile image upload can fail before the Firestore write, leaving the profile unchanged.
- `account.html` hides the body before auth resolves, so load failures can look like a blank page.
- `firebase-config.js` logs startup failures from module load, which can be noisy even when other parts of the page work.

### Fast checks
1. Confirm auth state in browser.
2. Check browser console for Firebase error code.
3. Match denied path to relevant rule block.
4. Reproduce in emulator before changing production rules.

## Annotated Snippet
```js
const testQuery = query(collection(db, "connection_test"), limit(1));
await getDocs(testQuery);
```
- Runs automatically when `firebase-config.js` loads.
- Throws permission errors if user is not authenticated.
- This is expected with current rules.

## Common Mistakes
- Treating expected permission errors as random failures.
- Testing only in production instead of emulator first.
- Leaving outdated docs after changing rules fields.
- Renaming ids such as `#google-login`, `#google-signup`, `#profile-form`, or `#expiration-date` without updating JavaScript.
- Assuming a file name like `deals-service.js` means the feature is implemented today.

## Official Docs Links
- Firestore rules simulator: https://firebase.google.com/docs/rules/simulator
- Connect app to Firestore emulator: https://firebase.google.com/docs/emulator-suite/connect_firestore
- Firebase CLI troubleshooting: https://firebase.google.com/docs/cli

