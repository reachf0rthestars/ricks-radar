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
- `public/backend/deals-service.js`: deal data and image upload service.
- `firebase.json`, `.firebaserc`, `firestore.rules`, `storage.rules`: Firebase configuration and security.
- `.github/workflows/`: CI/CD pipelines.
- `docs/docusaurus/`: this documentation site.

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

## Official Docs Links
- Firebase CLI config: https://firebase.google.com/docs/cli#the_firebasejson_file
- Hosting config: https://firebase.google.com/docs/hosting/full-config

