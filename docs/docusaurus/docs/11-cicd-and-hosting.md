---
id: 11-cicd-and-hosting
title: CI/CD and Firebase Hosting
---

## Document Metadata
- Owner: Release Owner
- Last-Verified: 2026-04-01
- Review-Cadence: Monthly
- Status: active

## What This Is
How GitHub Actions deploy the app and docs to Firebase Hosting.

## Why It Exists
You need to know which branch deploys what and which secrets are required.

## How It Works Here
- Existing workflows:
  - `.github/workflows/firebase-hosting-pull-request.yml`: PR preview deploy for app.
  - `.github/workflows/firebase-hosting-merge.yml`: `main` merge deploy for app live site.
- New workflow (this implementation):
  - `.github/workflows/docs-hosting-deploy.yml`.
  - Trigger: push to branch `docs`.
  - Build Docusaurus from `docs/docusaurus`.
  - Deploy to Hosting site `ricksradar-dev-docs`.

## Annotated Snippet
```yaml
on:
  push:
    branches:
      - docs
```
- Workflow only triggers when branch is exactly `docs`.
- Keeps docs deploy isolated from production app deploy.

## Common Mistakes
- Assuming app workflow deploys Firestore/Storage rules.
- Using wrong service account secret or project ID.
- Changing docs build path without updating workflow.

## Official Docs Links
- Action hosting deploy: https://github.com/FirebaseExtended/action-hosting-deploy
- GitHub Actions syntax: https://docs.github.com/actions/using-workflows/workflow-syntax-for-github-actions
- Firebase Hosting: https://firebase.google.com/docs/hosting
