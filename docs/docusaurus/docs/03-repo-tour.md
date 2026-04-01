---
id: 03-repo-tour
title: Repository Tour
---

## Document Metadata
- Owner: Engineering
- Last-Verified: 2026-04-01
- Review-Cadence: Monthly
- Status: active

## What This Is
A guide to where everything lives in the repository.

## Why It Exists
New contributors need a fast map before touching code.

## How It Works Here
- `public/`: live site HTML/CSS/JS.
- `public/backend/pages/`: one controller module per page.
- `public/backend/shared/`: shared UI and profile utilities.
- `public/backend/deals-service.js`: placeholder for future deal service work.
- `public/backend/voting-service.js`: placeholder for future voting persistence.
- `firebase.json`, `.firebaserc`: Firebase hosting configuration currently present in this repo.
- `.github/workflows/`: CI/CD pipelines.
- `docs/docusaurus/`: this documentation site.
- `frontend/`, `backend/`, and `submission/`: present in the repo, but not the active browser app documented in these pages.

## Best Starting Points
- [System Overview](./02-system-overview)
- [Page Deep Dives](./08-page-deep-dives)
- [HTML-to-JS DOM Contracts](./14-html-js-dom-contracts)
- Reference pages under `Reference` in the sidebar

## Annotated Snippet
```json
{
  "hosting": {
    "public": "public",
    "rewrites": [{ "source": "**", "destination": "/index.html" }]
  }
}
```
- `public` tells Firebase Hosting where static files are.
- `rewrites` routes unmatched URLs to `index.html`.

## Common Mistakes
- Editing `frontend/` assuming it is the active site path.
- Changing rules without documenting the change in docs.
- Treating placeholder service files as production-ready APIs.

## Official Docs Links
- Firebase CLI config: https://firebase.google.com/docs/cli#the_firebasejson_file
- Hosting config: https://firebase.google.com/docs/hosting/full-config

