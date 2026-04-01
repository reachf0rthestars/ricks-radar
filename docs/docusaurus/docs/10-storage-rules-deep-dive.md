---
id: 10-storage-rules-deep-dive
title: Storage Rules Deep Dive
---

## Document Metadata
- Owner: Firebase Owner
- Last-Verified: 2026-04-01
- Review-Cadence: Monthly
- Status: active

## What This Is
How `storage.rules` protects uploaded files.

## Why It Exists
Without storage rules, anyone could upload or replace files in your bucket.

## How It Works Here
- `isAuthenticated`: requires signed-in user.
- `isOwner(uid)`: request user must match path uid.
- `isImageUpload`: content type must be `image/*` and under 5 MB.
- Path policies:
  - `/profileImages/{uid}/{fileName}`: owner read/write/delete.
  - `/dealImages/{uid}/{fileName}`: any authenticated user can read; owner can write/delete.
- Catch-all deny for all other paths.

## Annotated Snippet
```text
match /dealImages/{uid}/{fileName} {
  allow read: if isAuthenticated();
  allow create, update: if isOwner(uid) && isImageUpload();
}
```
- Signed-in users can view deal images.
- Only file owner can upload/replace.
- Non-image files and large files are rejected.

## Common Mistakes
- Uploading files over 5 MB and assuming the UI is broken.
- Expecting anonymous users to view deal images.
- Changing folder naming conventions without updating rules and upload code.

## Official Docs Links
- Storage security rules: https://firebase.google.com/docs/storage/security
- Storage web upload: https://firebase.google.com/docs/storage/web/upload-files

