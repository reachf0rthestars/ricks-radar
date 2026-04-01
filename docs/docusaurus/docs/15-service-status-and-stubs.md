---
id: 15-service-status-and-stubs
title: Service Status and Stubs
---

## Document Metadata
- Owner: Frontend
- Last-Verified: 2026-04-01
- Review-Cadence: Monthly
- Status: active

## What This Is
A status page for the service modules that are present in the repo but not yet implemented as working feature code.

## Current Status
### `public/backend/deals-service.js`
- Currently a stub.
- The file only contains placeholder comments and does not export a real deal service API yet.
- Treat any mention of deal CRUD in the UI docs as future work until this module is implemented.

### `public/backend/voting-service.js`
- Currently empty.
- There is no active voting service logic in the repo yet.
- Client-side badge toggles exist in `index-page.js`, but they do not persist votes.

## What Is Implemented Instead
- Deal cards on the home page are static HTML today.
- Voting badges only toggle local visual state.
- Page controllers handle form behavior, auth routing, and profile edits, but not full deal storage workflows.

## How to Read This Status
- If a doc page says a service is stubbed, that is deliberate.
- Do not infer Firestore or Storage behavior from a placeholder file.
- Use [Page Deep Dives](./08-page-deep-dives) and the page reference docs for the implemented page-controller behavior.
- See [Firebase Bootstrap and Services](./reference/shared/shared-firebase-config) for the runtime services shared by the app.

## Related Docs
- [Repo Tour](./03-repo-tour)
- [System Overview](./02-system-overview)
- [Page Deep Dives](./08-page-deep-dives)
- [Troubleshooting and Pitfalls](./12-troubleshooting-and-pitfalls)
- [Shared Navigation and Menu System](./reference/shared/shared-menu)
- [index-page.js](./reference/pages/index-page)
