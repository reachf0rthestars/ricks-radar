---
id: 09-firestore-rules-deep-dive
title: Firestore Rules Deep Dive
---

## Document Metadata
- Owner: Firebase Owner
- Last-Verified: 2026-04-01
- Review-Cadence: Monthly
- Status: active

## What This Is
A plain-language explanation of `firestore.rules`, including helper functions, validators, and match blocks.

## Why It Exists
Rules are the real backend authorization layer. Every Firestore read/write is allowed or denied here.

## How It Works Here
- Helper functions:
  - `isAuthenticated`, `isOwner` for identity checks.
  - `isValidUsername`, `isValidDateString`, `isValidCategories` for input shape checks.
  - `isValidUser`, `isValidUsernameMap`, `isValidDeal` for full document schema checks.
- Collection policies:
  - `/users/{userId}`: owner-only read/write with immutable username/email/createdAt constraints.
  - `/usernames/{usernameKey}`: authenticated lookup and controlled create/update.
  - `/deals/{dealId}`: authenticated read; only deal owner can update/delete.
  - `/connection_test/{docId}`: read requires auth.
  - Catch-all deny for everything else.

## Data Model Contract
- `users`: profile and stat fields with strong type constraints.
- `usernames`: lowercase username index document mapped to uid.
- `deals`: deal content + creator identity + counters.

## Annotated Snippet
```text
match /deals/{dealId} {
  allow read: if isAuthenticated();
  allow update: if isAuthenticated()
    && resource.data.createdByUid == request.auth.uid;
}
```
- Any signed-in user can read deals.
- Only the original creator can modify a deal.
- This blocks non-owner voting updates unless architecture changes.

## Common Mistakes
- Expecting anonymous users to read deals.
- Expecting public profile reads from `users` collection.
- Adding new document fields in code without updating rules validators.

## Official Docs Links
- Firestore rules get started: https://firebase.google.com/docs/firestore/security/get-started
- Rules conditions: https://firebase.google.com/docs/firestore/security/rules-conditions
- Rules language reference: https://firebase.google.com/docs/rules/rules-language

